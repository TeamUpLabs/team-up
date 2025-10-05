"use client";

import { useState } from "react";
import ModalTemplete from "@/components/ModalTemplete";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import DatePicker from "@/components/ui/DatePicker";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { Calendar, FileText, User } from "lucide-react";
import { useAuthStore } from "@/auth/authStore";
import { NewSessionForm, blankNewSessionForm } from "@/types/mentoring/MentorSession";
import { Mentor } from "@/types/mentoring/Mentor";
import { createSession } from "@/hooks/mentoring/getMentorSessionData";
import { useMentoring } from "@/contexts/MentoringContext";

interface NewSessionModalProps {
  mentor: Mentor;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewSessionModal({ mentor, isOpen, onClose }: NewSessionModalProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<NewSessionForm>(blankNewSessionForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NewSessionForm, string>>>({});
  const user = useAuthStore.getState().user;
  const { addSession } = useMentoring();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewSessionForm, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "세션 제목을 입력해주세요";
    }

    if (!formData.description.trim()) {
      newErrors.description = "세션 설명을 입력해주세요";
    }

    if (!formData.start_date) {
      newErrors.start_date = "시작 날짜를 선택해주세요";
    }

    if (!formData.end_date) {
      newErrors.end_date = "종료 날짜를 선택해주세요";
    }

    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = "종료 날짜는 시작 날짜보다 늦어야 합니다";
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
      const sessionData = {
        ...formData,
        mentor_id: mentor.user.id || 0,
        mentee_id: user?.id || 0,
      };

      console.log("New session data:", sessionData);

      const session = await createSession(sessionData);

      setSubmitStatus('success');
      await addSession(session);
      useAuthStore.getState().setAlert("세션이 성공적으로 예약되었습니다.", "success");
    } catch (error) {
      console.error("Failed to create session:", error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("세션 예약에 실패했습니다. 다시 시도해주세요.", "error");
    } finally {
      setTimeout(() => {
        onClose();
        setFormData(blankNewSessionForm);
        setSubmitStatus('idle');
      }, 1000);
    }
  };

  return (
    <ModalTemplete
      header={
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-text-primary">세션 예약</h2>
          <p className="text-sm text-text-secondary">
            {mentor.user.name}님의 세션을 예약해주세요
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
              buttonText="세션 예약하기"
              successText="예약 완료!"
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <FileText className="w-5 h-5 text-point-color-indigo" />
            <h3 className="text-lg font-semibold">세션 정보</h3>
          </div>
          <Input
            label="세션 제목"
            isRequired
            placeholder="예: React 기초 강의"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, title: e.target.value }));
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: undefined }));
              }
            }}
            error={errors.title}
            fullWidth
          />
        </div>

        {/* Description Section */}
        <div className="space-y-3">
          <TextArea
            label="세션 설명"
            isRequired
            placeholder="세션에서 다룰 내용이나 학습 목표를 자세히 설명해주세요."
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: undefined }));
              }
            }}
            error={errors.description}
            rows={4}
            fullWidth
          />
        </div>

        {/* Date Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <Calendar className="w-5 h-5 text-point-color-green" />
            <h3 className="text-lg font-semibold">일정</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                label="시작 날짜"
                isRequired
                value={formData.start_date ? new Date(formData.start_date) : undefined}
                onChange={(date) => {
                  setFormData(prev => ({
                    ...prev,
                    start_date: date ? date.toISOString() : ""
                  }));
                  if (errors.start_date) {
                    setErrors(prev => ({ ...prev, start_date: undefined }));
                  }
                }}
                placeholder="시작 날짜 선택"
                minDate={new Date()}
              />
              {errors.start_date && (
                <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
              )}
            </div>
            <div>
              <DatePicker
                label="종료 날짜"
                isRequired
                value={formData.end_date ? new Date(formData.end_date) : undefined}
                onChange={(date) => {
                  setFormData(prev => ({
                    ...prev,
                    end_date: date ? date.toISOString() : ""
                  }));
                  if (errors.end_date) {
                    setErrors(prev => ({ ...prev, end_date: undefined }));
                  }
                }}
                placeholder="종료 날짜 선택"
                minDate={formData.start_date ? new Date(formData.start_date) : new Date()}
              />
              {errors.end_date && (
                <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>
        </div>

        {/* Mentor Info Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <User className="w-5 h-5 text-point-color-purple" />
            <h3 className="text-lg font-semibold">멘토 정보</h3>
          </div>
          <div className="p-4 bg-component-secondary-background rounded-lg border border-component-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-point-color-indigo/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-point-color-indigo" />
              </div>
              <div>
                <p className="font-medium text-text-primary">{mentor.user.name}</p>
                <p className="text-sm text-text-secondary">멘토</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ModalTemplete>
  );
}