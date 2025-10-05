"use client";

import { useState } from "react";
import ModalTemplete from "@/components/ModalTemplete";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import Badge from "@/components/ui/Badge";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { MapPin, Award, BookOpen, Clock } from "lucide-react";
import { useAuthStore } from "@/auth/authStore";
import { MentorFormData, blankMentorFormData } from "@/types/mentoring/Mentor";
import { createMentor } from "@/hooks/mentoring/getMentorData";
import { useMentoring } from "@/contexts/MentoringContext";

const topicOptions = [
  "React", "Vue", "Angular", "Node.js", "Python", "Java", "Spring",
  "JavaScript", "TypeScript", "Go", "Rust", "DevOps", "AWS", "Docker",
  "Kubernetes", "CI/CD", "데이터베이스", "UI/UX", "프로젝트 관리", "기타"
];

const availabilityOptions = [
  { id: "1on1", label: "1:1 멘토링", icon: "👤" },
  { id: "group", label: "그룹 멘토링", icon: "👥" },
  { id: "code-review", label: "코드 리뷰", icon: "💻" },
  { id: "career", label: "커리어 상담", icon: "💼" },
  { id: "portfolio", label: "포트폴리오 리뷰", icon: "📁" },
  { id: "interview", label: "면접 준비", icon: "🎯" },
];

export default function EnrollMentorModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<MentorFormData>(blankMentorFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof MentorFormData, string>>>({});
  const [customTopic, setCustomTopic] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const user = useAuthStore.getState().user;
  const { mentors, addMentor } = useMentoring();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MentorFormData, string>> = {};

    if (!user) {
      newErrors.user_id = "사용자 정보를 찾을 수 없습니다";
    }

    if (mentors.some(m => m.user.id === user?.id)) {
      newErrors.user_id = "이미 등록된 멘토입니다";
    }

    if (formData.location.length === 0) {
      newErrors.location = "최소 1개 이상의 활동 지역을 입력해주세요";
    }
    if (!formData.experience || formData.experience < 0) {
      newErrors.experience = "경력 연수를 입력해주세요";
    }
    if (formData.topic.length === 0) {
      newErrors.topic = "최소 1개 이상의 주제를 선택해주세요";
    }
    if (formData.availablefor.length === 0) {
      newErrors.availablefor = "제공 가능한 멘토링 유형을 선택해주세요";
    }

    if (!formData.bio) {
      newErrors.bio = "자기소개를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const submitForm = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitStatus('submitting');

    try {
      console.log("Mentor registration data:", {
        ...formData,
        user_id: user?.id || 0,
      });
      // Simulate API call
      const mentor = await createMentor({
        ...formData,
        user_id: user?.id || 0,
      });

      setSubmitStatus('success');
      useAuthStore.getState().setAlert("멘토 등록이 성공적으로 완료되었습니다.", "success");
      addMentor(mentor);
    } catch (error) {
      console.error("Failed to register mentor:", error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("멘토 등록에 실패했습니다. 관리자에게 문의해주세요.", "error");
    } finally {
      setTimeout(() => {
        onClose();
        // Reset form
        setFormData(blankMentorFormData);
        setLocationInput("");
        setCustomTopic("");
        setSubmitStatus('idle');
      }, 1000);
    }
  };

  const handleTopicAdd = (topic: string) => {
    if (!formData.topic.includes(topic)) {
      setFormData(prev => ({
        ...prev,
        topic: [...prev.topic, topic]
      }));
      if (errors.topic) {
        setErrors(prev => ({ ...prev, topic: undefined }));
      }
    }
  };

  const handleTopicRemove = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topic: prev.topic.filter(t => t !== topic)
    }));
  };

  const handleCustomTopicAdd = () => {
    if (customTopic.trim() && !formData.topic.includes(customTopic.trim())) {
      handleTopicAdd(customTopic.trim());
      setCustomTopic("");
    }
  };

  const handleLocationAdd = () => {
    if (locationInput.trim() && !formData.location.includes(locationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        location: [...prev.location, locationInput.trim()]
      }));
      setLocationInput("");
      if (errors.location) {
        setErrors(prev => ({ ...prev, location: undefined }));
      }
    }
  };

  const handleLocationRemove = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location: prev.location.filter(l => l !== location)
    }));
  };

  const toggleAvailability = (id: string) => {
    setFormData(prev => ({
      ...prev,
      availablefor: prev.availablefor.includes(id)
        ? prev.availablefor.filter(a => a !== id)
        : [...prev.availablefor, id]
    }));
    if (errors.availablefor) {
      setErrors(prev => ({ ...prev, availablefor: undefined }));
    }
  };

  return (
    <ModalTemplete
      header={
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-text-primary">멘토 등록</h2>
          <p className="text-sm text-text-secondary">
            다른 개발자들과 지식을 공유하고 성장을 도와주세요
          </p>
        </div>
      }
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-md text-base font-medium border border-component-border text-text-primary hover:bg-component-secondary-background transition-colors"
          >
            취소
          </button>
          <div className="flex-1">
            <SubmitBtn
              submitStatus={submitStatus}
              onClick={submitForm}
              buttonText="멘토 등록하기"
              successText="등록 완료!"
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <MapPin className="w-5 h-5 text-point-color-indigo" />
            <h3 className="text-lg font-semibold">활동 지역</h3>
          </div>
          <div className="space-y-3">
            {/* Location Input */}
            <div className="flex gap-2">
              <Input
                label="활동 지역"
                isRequired
                placeholder="예: 서울, 경기, 원격"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLocationAdd();
                  }
                }}
                fullWidth
              />
            </div>
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location}</p>
            )}

            {/* Selected Locations */}
            {formData.location.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.location.map((location) => (
                  <Badge
                    key={location}
                    content={location}
                    color="indigo"
                    isEditable
                    onRemove={() => handleLocationRemove(location)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Experience Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <Award className="w-5 h-5 text-point-color-purple" />
            <h3 className="text-lg font-semibold">경력</h3>
          </div>
          <Input
            label="경력 연수"
            isRequired
            type="text"
            placeholder="예: 3"
            value={formData.experience}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setFormData(prev => ({ ...prev, experience: parseInt(value) }));
              if (errors.experience) {
                setErrors(prev => ({ ...prev, experience: undefined }));
              }
            }}
            error={errors.experience}
            fullWidth
            endAdornment={
              <span className="text-text-secondary">년</span>
            }
          />
        </div>

        {/* Topics Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <BookOpen className="w-5 h-5 text-point-color-green" />
            <h3 className="text-lg font-semibold">전문 분야</h3>
          </div>
          <div className="space-y-3">
            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                주제 선택 <span className="text-point-color-purple">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {topicOptions.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicAdd(topic)}
                    disabled={formData.topic.includes(topic)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${formData.topic.includes(topic)
                        ? "bg-component-secondary-background text-text-secondary cursor-not-allowed opacity-50"
                        : "bg-component-background border border-component-border text-text-primary hover:border-point-color-indigo hover:bg-component-secondary-background cursor-pointer"
                      }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Topic Input */}
            <div className="flex gap-2">
              <Input
                placeholder="직접 입력하기..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomTopicAdd();
                  }
                }}
                fullWidth
              />
            </div>
            {errors.topic && (
              <p className="text-sm text-red-600">{errors.topic}</p>
            )}

            {/* Selected Topics */}
            {formData.topic.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-component-secondary-background rounded-lg border border-component-border">
                {formData.topic.map((topic) => (
                  <Badge
                    key={topic}
                    content={topic}
                    color="indigo"
                    isEditable
                    onRemove={() => handleTopicRemove(topic)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available For Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <Clock className="w-5 h-5 text-point-color-orange" />
            <h3 className="text-lg font-semibold">제공 가능한 멘토링</h3>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              멘토링 유형 <span className="text-point-color-purple">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availabilityOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleAvailability(option.id)}
                  className={`p-3 rounded-lg border-2 transition-all active:scale-95 cursor-pointer ${formData.availablefor.includes(option.id)
                      ? "border-point-color-indigo bg-point-color-indigo/10"
                      : "border-component-border hover:border-point-color-indigo hover:bg-point-color-indigo/10"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-sm font-medium text-text-primary">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
            {errors.availablefor && (
              <p className="text-sm text-red-600">{errors.availablefor}</p>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-3">
          <TextArea
            label="자기소개"
            isRequired
            placeholder="멘티들에게 자신을 소개해주세요. 어떤 도움을 제공할 수 있는지, 멘토링 스타일 등을 자유롭게 작성해주세요."
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            fullWidth
          />
        </div>
      </form>
    </ModalTemplete>
  );
}