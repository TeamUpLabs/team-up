"use client";

import { useState } from "react";
import ModalTemplete from "@/components/ModalTemplete";
import { TextArea } from "@/components/ui/TextArea";
import StarRating from "@/components/ui/StarRating";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { MessageSquare, Star } from "lucide-react";
import { useAuthStore } from "@/auth/authStore";
import { NewMentorReviewForm, blankNewMentorReviewForm } from "@/types/mentoring/MentorReview";
import { Mentor } from "@/types/mentoring/Mentor";
import { createReview } from "@/hooks/mentoring/getMentorReviewData";
import { useMentoring } from "@/contexts/MentoringContext";
import { convertJobName } from "@/utils/ConvertJobName";

interface NewReviewModalProps {
  mentor: Mentor;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewReviewModal({ mentor, isOpen, onClose }: NewReviewModalProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<NewMentorReviewForm>(blankNewMentorReviewForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NewMentorReviewForm, string>>>({});
  const user = useAuthStore.getState().user;
  const { addReview } = useMentoring();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewMentorReviewForm, string>> = {};

    if (formData.rating === 0) {
      newErrors.rating = "별점을 선택해주세요";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "후기 내용을 입력해주세요";
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
      const reviewData = {
        ...formData,
        mentor_id: mentor.user.id || 0,
        user_id: user?.id || 0,
      };

      const review = await createReview(reviewData);

      setSubmitStatus('success');
      await addReview(review);
      useAuthStore.getState().setAlert("후기가 성공적으로 등록되었습니다.", "success");
    } catch (error) {
      console.error("Failed to create review:", error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("후기 등록에 실패했습니다. 다시 시도해주세요.", "error");
    } finally {
      setTimeout(() => {
        onClose();
        setFormData(blankNewMentorReviewForm);
        setSubmitStatus('idle');
      }, 1000);
    }
  };

  return (
    <ModalTemplete
      header={
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-text-primary">후기 작성</h2>
          <p className="text-sm text-text-secondary">
            {mentor.user.name}님과의 멘토링 경험을 공유해주세요
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
              buttonText="후기 등록하기"
              successText="등록 완료!"
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">별점</h3>
          </div>
          <div className="flex items-start gap-4">
            <StarRating
              value={formData.rating}
              onChange={(rating) => {
                setFormData(prev => ({ ...prev, rating }));
                if (errors.rating) {
                  setErrors(prev => ({ ...prev, rating: undefined }));
                }
              }}
              size="lg"
            />
          </div>
          {errors.rating && (
            <p className="text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Comment Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <MessageSquare className="w-5 h-5 text-point-color-blue" />
            <h3 className="text-lg font-semibold">후기 내용</h3>
          </div>
          <TextArea
            label="멘토링 경험을 자세히 작성해주세요"
            isRequired
            placeholder="어떤 점이 좋았는지, 개선할 점이 있었는지 솔직하게 작성해주세요."
            value={formData.comment}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, comment: e.target.value }));
              if (errors.comment) {
                setErrors(prev => ({ ...prev, comment: undefined }));
              }
            }}
            error={errors.comment}
            rows={5}
            fullWidth
          />
        </div>

        {/* Mentor Info Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-primary">
            <div className="w-5 h-5 bg-point-color-purple rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">M</span>
            </div>
            <h3 className="text-lg font-semibold">멘토 정보</h3>
          </div>
          <div className="p-4 bg-component-secondary-background rounded-lg border border-component-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-point-color-indigo/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-point-color-indigo">
                  {mentor.user.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-text-primary">{mentor.user.name}</p>
                <p className="text-sm text-text-secondary">{convertJobName(mentor.user.job)}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ModalTemplete>
  );
}