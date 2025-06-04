import { useState, useEffect } from "react";
import Image from "next/image";
import ModalTemplete from "@/components/ModalTemplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faUserGroup,
  faCalendarCheck,
  faLocationDot,
  faLink,
  faClock,
  faFileLines,
  faUsers,
  faCheck,
  faVideo,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import DateTimePicker from "@/components/ui/DateTimePicker";
import SubmitBtn from "@/components/SubmitBtn";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { MiniLogo } from "@/components/logo";
import { createSchedule } from "@/hooks/getScheduleData";

type ScheduleType = "meeting" | "event";
type MeetingPlatform = "zoom" | "google" | "teamup";

export default function ScheduleCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const user = useAuthStore((state) => state.user);
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState<ScheduleType>("meeting");
  const [selectedPlatform, setSelectedPlatform] = useState<MeetingPlatform>();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");
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

  useEffect(() => {
    if (formData.start_time && formData.end_time) {
      setDateError(new Date(formData.end_time) < new Date(formData.start_time));
    } else {
      setDateError(false);
    }
  }, [formData.start_time, formData.end_time]);

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformSelect = (platform: MeetingPlatform) => {
    setSelectedPlatform(platform);
    setFormData((prev) => ({
      ...prev,
      where: platform,
      link: platform === "teamup" ? "" : prev.link,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (dateError) {
      hasError = true;
    }

    if (formData.assignee_id.length === 0) {
      useAuthStore
        .getState()
        .setAlert("참석자가 최소한 한명은 선택되어야 합니다.", "error");
      hasError = true;
    }

    if (
      selectedPlatform !== "teamup" &&
      formData.link === "" &&
      formData.type === "meeting"
    ) {
      useAuthStore.getState().setAlert("링크를 입력해주세요.", "error");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setSubmitStatus("submitting");

    console.log(formData);

    if (project?.id && hasError === false) {
      try {
        await createSchedule(project.id, formData);
        setSubmitStatus("success");
        useAuthStore
          .getState()
          .setAlert("일정이 성공적으로 생성되었습니다.", "success");

        setTimeout(() => {
          setSubmitStatus("idle");
          onClose();
        }, 1000);
      } catch (error) {
        console.error(error);
        useAuthStore
          .getState()
          .setAlert(
            "일정 생성에 실패했습니다. 관리자에게 문의해주세요.",
            "error"
          );
      }
    }
    // Reset form and close modal
    setFormData({
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
    onClose();
  };

  const handleTabChange = (tabId: ScheduleType) => {
    setActiveTab(tabId);
    setFormData((prev) => ({ ...prev, type: tabId }));
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

  const tabs = [
    {
      id: "meeting" as ScheduleType,
      label: "회의",
      icon: faUserGroup,
      description: "팀 회의 및 미팅 일정을 등록합니다.",
    },
    {
      id: "event" as ScheduleType,
      label: "이벤트",
      icon: faCalendarCheck,
      description: "프로젝트 이벤트 및 중요 행사를 등록합니다.",
    },
  ];

  const modalHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="text-primary-600 text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          새로운 일정 추가
        </h3>
        <p className="text-sm text-text-tertiary mt-0.5">
          프로젝트 일정을 관리하세요
        </p>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="mb-6">
      <div className="flex bg-component-secondary-background rounded-lg p-1 mb-4 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`flex items-center justify-center flex-1 space-x-2 px-4 py-2.5 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-component-background shadow-sm text-text-primary-color font-medium"
                : "text-text-secondary hover:bg-component-background hover:text-text-primary-color"
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            <FontAwesomeIcon
              icon={tab.icon}
              className={`${
                activeTab === tab.id
                  ? "text-text-primary-color"
                  : "text-text-tertiary"
              }`}
            />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="py-2 mb-2"
        >
          <p className="text-sm text-text-tertiary p-4 border border-component-border rounded-lg">
            {tabs.find((tab) => tab.id === activeTab)?.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Common fields for all schedule types
  const commonFields = (
    <div className="space-y-5">
      <div className="bg-component-background rounded-lg">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center rounded-full mr-2">
            <FontAwesomeIcon
              icon={faFileLines}
              className="text-text-primary-color text-sm"
            />
          </div>
          <h4 className="font-medium text-text-primary-color">기본 정보</h4>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="flex items-center text-sm font-medium mb-2 text-text-secondary"
            >
              제목 <span className="text-point-color-purple ml-1">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
              placeholder="일정 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="flex items-center text-sm font-medium mb-2 text-text-secondary"
            >
              설명 <span className="text-point-color-purple ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover resize-none"
              placeholder="일정에 대한 설명을 입력하세요"
            />
          </div>

          <div>
            <label
              htmlFor="memo"
              className="flex items-center text-sm font-medium mb-2 text-text-secondary"
            >
              메모
            </label>
            <input
              type="text"
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
              placeholder="메모를 입력하세요 (선택사항)"
            />
          </div>
        </div>
      </div>

      <div className="bg-component-background rounded-lg">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center rounded-full mr-2">
            <FontAwesomeIcon
              icon={faClock}
              className="text-text-primary-color text-sm"
            />
          </div>
          <h4 className="font-medium text-text-primary-color">일정 시간</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateTimePicker
            id="start_time"
            name="start_time"
            label="시작 일시"
            value={formData.start_time}
            onChange={handleChange}
            placeholder="시작 일시를 선택하세요"
            required
          />

          <DateTimePicker
            id="end_time"
            name="end_time"
            label="종료 일시"
            value={formData.end_time}
            onChange={handleChange}
            placeholder="종료 일시를 선택하세요"
            required
          />
          {dateError && (
            <p className="text-red-500 text-sm">
              종료일은 시작일 이후여야 합니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Meeting specific fields
  const meetingFields = (
    <div className="space-y-5">
      <div className="bg-component-background rounded-lg">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center rounded-full mr-2">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-text-primary-color text-sm"
            />
          </div>
          <h4 className="font-medium text-text-primary-color">회의 위치</h4>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium mb-2 text-text-secondary">
              회의 플랫폼{" "}
              <span className="text-point-color-purple ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {/* Zoom */}
              <div
                onClick={() => handlePlatformSelect("zoom")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPlatform === "zoom"
                    ? "bg-blue-500/20 border border-blue-500/50"
                    : "bg-component-secondary-background border border-component-border"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faVideo} className="text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-text-primary">Zoom</p>
                </div>
              </div>

              {/* Google Meet */}
              <div
                onClick={() => handlePlatformSelect("google")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPlatform === "google"
                    ? "bg-red-500/20 border border-red-500/50"
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
                onClick={() => handlePlatformSelect("teamup")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPlatform === "teamup"
                    ? "bg-purple-500/20 border border-purple-500/50"
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

            {selectedPlatform !== "teamup" && (
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
                    <FontAwesomeIcon
                      icon={faLink}
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
                      selectedPlatform === "zoom"
                        ? "Zoom 회의 링크를 입력하세요"
                        : selectedPlatform === "google"
                        ? "Google Meet 링크를 입력하세요"
                        : "화상 회의 링크를 입력하세요"
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-component-background rounded-lg">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center rounded-full mr-2">
            <FontAwesomeIcon
              icon={faUsers}
              className="text-text-primary-color text-sm"
            />
          </div>
          <h4 className="font-medium text-text-primary-color">
            참석자 <span className="text-point-color-purple ml-1">*</span>
          </h4>
        </div>

        <div className="border border-component-border rounded-lg p-3 bg-component-secondary-background hover:border-component-border-hover transition-all">
          <div className="mb-3">
            <p className="text-sm text-text-secondary">
              선택된 담당자:{" "}
              {formData.assignee_id.length > 0
                ? `${formData.assignee_id.length}명`
                : "없음"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project?.members.map((member) => (
              <div
                key={member.id}
                onClick={() => toggleAssignee(member.id)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isAssigned(member.id)
                    ? "bg-purple-500/20 border border-purple-500/50"
                    : "bg-component-tertiary-background border border-component-border"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-component-secondary-background border-2 border-component-border flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {member.profileImage ? (
                        <Image
                          src={member.profileImage}
                          alt={member.name}
                          width={50}
                          height={50}
                          className={`absolute text-text-secondary transform transition-all duration-300 ${
                            isAssigned(member.id)
                              ? "opacity-0 rotate-90 scale-0"
                              : "opacity-100 rotate-0 scale-100"
                          }`}
                          onError={(e) => {
                            e.currentTarget.src = "/DefaultProfile.jpg";
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faUser}
                          className={`absolute text-text-secondary transform transition-all duration-300 ${
                            isAssigned(member.id)
                              ? "opacity-0 rotate-90 scale-0"
                              : "opacity-100 rotate-0 scale-100"
                          }`}
                        />
                      )}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={`absolute text-text-secondary transform transition-all duration-300 ${
                          isAssigned(member.id)
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
                  <p className="text-xs text-text-secondary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Event specific fields
  const eventFields = (
    <div className="space-y-5">
      <div className="bg-component-background rounded-lg">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center rounded-full mr-2">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-text-primary-color text-sm"
            />
          </div>
          <h4 className="font-medium text-text-primary-color">
            이벤트 위치 <span className="text-point-color-purple ml-1">*</span>
          </h4>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-text-tertiary text-sm"
            />
          </div>
          <input
            type="text"
            id="where"
            name="where"
            value={formData.where}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
            placeholder="이벤트 장소"
          />
        </div>
      </div>

      <div className="bg-component-background rounded-lg">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center rounded-full mr-2">
            <FontAwesomeIcon
              icon={faUsers}
              className="text-text-primary-color text-sm"
            />
          </div>
          <h4 className="font-medium text-text-primary-color">
            참석자 <span className="text-point-color-purple ml-1">*</span>
          </h4>
        </div>

        <div className="border border-component-border rounded-lg p-3 bg-component-secondary-background hover:border-component-border-hover transition-all">
          <div className="mb-3">
            <p className="text-sm text-text-secondary">
              선택된 담당자:{" "}
              {formData.assignee_id.length > 0
                ? `${formData.assignee_id.length}명`
                : "없음"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project?.members.map((member) => (
              <div
                key={member.id}
                onClick={() => toggleAssignee(member.id)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isAssigned(member.id)
                    ? "bg-purple-500/20 border border-purple-500/50"
                    : "bg-component-tertiary-background border border-component-border"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-component-secondary-background flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {member.profileImage ? (
                        <Image
                          src={member.profileImage}
                          alt={member.name}
                          width={50}
                          height={50}
                          className={`absolute text-text-secondary transform transition-all duration-300 ${
                            isAssigned(member.id)
                              ? "opacity-0 rotate-90 scale-0"
                              : "opacity-100 rotate-0 scale-100"
                          }`}
                          onError={(e) => {
                            e.currentTarget.src = "/DefaultProfile.jpg";
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faUser}
                          className={`absolute text-text-secondary transform transition-all duration-300 ${
                            isAssigned(member.id)
                              ? "opacity-0 rotate-90 scale-0"
                              : "opacity-100 rotate-0 scale-100"
                          }`}
                        />
                      )}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={`absolute text-text-secondary transform transition-all duration-300 ${
                          isAssigned(member.id)
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
                  <p className="text-xs text-text-secondary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModalTemplete isOpen={isOpen} onClose={onClose} header={modalHeader}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderTabs()}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-5"
          >
            {commonFields}
            {activeTab === "meeting" && meetingFields}
            {activeTab === "event" && eventFields}
          </motion.div>
        </AnimatePresence>

        <div className="pt-4 border-t border-component-border">
          <SubmitBtn
            submitStatus={submitStatus}
            onClick={() =>
              handleSubmit(new Event("click") as unknown as React.FormEvent)
            }
          />
        </div>
      </form>
    </ModalTemplete>
  );
}
