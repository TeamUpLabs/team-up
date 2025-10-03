"use client";

import React, { useState, useEffect } from "react";
import { collaborationStyles, projectTypes, preferred_roles } from "@/types/user/CollaborationPreference";
import Select from "@/components/ui/Select";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { updateUserProfile } from "@/hooks/getMemberData";
import { useAuthStore } from "@/auth/authStore";
import { useUser } from "@/contexts/UserContext";

export default function Preference() {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    collaborationStyle: "",
    projectType: "",
    preferredRole: "",
    preferredProjectLength: "",
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (user) {
      setFormData({
        collaborationStyle: user.collaboration_preference?.collaboration_style || "",
        projectType: user.collaboration_preference?.preferred_project_type || "",
        preferredRole: user.collaboration_preference?.preferred_role || "",
        preferredProjectLength: user.collaboration_preference?.preferred_project_length || "",
      })
    }
  }, [user])

  const handleCollaborationPreferenceChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setSubmitStatus("submitting");
      const response = await updateUserProfile({
        collaboration_preference: {
          collaboration_style: formData.collaborationStyle,
          preferred_project_type: formData.projectType,
          preferred_role: formData.preferredRole,
          preferred_project_length: formData.preferredProjectLength,
          available_time_zone: user.collaboration_preference?.available_time_zone || "",
          work_hours_start: user.collaboration_preference?.work_hours_start || "",
          work_hours_end: user.collaboration_preference?.work_hours_end || "",
        },
      });
      
      if (response) {
        setUser({
          ...user,
          collaboration_preference: {
            ...user.collaboration_preference,
            collaboration_style: formData.collaborationStyle,
            preferred_project_type: formData.projectType,
            preferred_role: formData.preferredRole,
            preferred_project_length: formData.preferredProjectLength,
            available_time_zone: user.collaboration_preference?.available_time_zone || "",
            work_hours_start: user.collaboration_preference?.work_hours_start || "",
            work_hours_end: user.collaboration_preference?.work_hours_end || "",
          },
        });
        useAuthStore.getState().setAlert("협업 선호도가 변경되었습니다.", "success");
        setSubmitStatus("success");
      }
    } catch (error) {
      console.error(error);
      useAuthStore.getState().setAlert("협업 선호도 변경 중 오류가 발생했습니다.", "error");
      setSubmitStatus("error");
    } finally {
      setSubmitStatus("idle");
    }
  }

  return (
    <div className="flex flex-col gap-4 border border-component-border rounded-lg p-6">
      <div className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="collaborationStyle"
            className="block text-sm font-medium text-text-secondary mb-3"
          >
            협업 스타일
          </label>
          <div className="grid grid-cols-2 gap-4">
            {collaborationStyles.map((style) => (
              <button
                key={style.value}
                type="button"
                className={`p-6 rounded-lg border border-component-border ${formData.collaborationStyle === style.value
                  ? "border-point-color-indigo bg-point-color-indigo/30"
                  : "border-component-border bg-component-secondary-background hover:bg-component-tertiary-background hover:border-point-color-indigo"
                  } transition-all duration-200 flex flex-col items-center cursor-pointer`}
                onClick={() => handleCollaborationPreferenceChange("collaborationStyle", style.value)}
              >
                <style.icon className="h-10 w-10 mb-3 text-point-color-indigo" />
                <span className="text-lg font-medium text-text-primary">
                  {style.label}
                </span>
                <span className="text-xs text-text-secondary mt-2 text-center">
                  {style.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="collaborationStyle"
            className="block text-sm font-medium text-text-secondary mb-3"
          >
            선호 프로젝트 타입
          </label>
          <div className="grid grid-cols-3 gap-4">
            {projectTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`p-6 rounded-lg border border-component-border ${formData.projectType === type.value
                  ? "border-point-color-indigo bg-point-color-indigo/30"
                  : "border-component-border bg-component-secondary-background hover:bg-component-tertiary-background hover:border-point-color-indigo"
                  } transition-all duration-200 flex flex-col items-center cursor-pointer`}
                onClick={() => handleCollaborationPreferenceChange("projectType", type.value)}
              >
                <type.icon className="h-10 w-10 mb-3 text-point-color-indigo" />
                <span className="text-lg font-medium text-text-primary">
                  {type.label}
                </span>
                <span className="text-xs text-text-secondary mt-2 text-center">
                  {type.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Select
          options={preferred_roles[user?.job as keyof typeof preferred_roles]}
          value={formData.preferredRole}
          onChange={(value) => handleCollaborationPreferenceChange("preferredRole", value as string)}
          placeholder="선호 역할을 선택해주세요"
          label="선호 역할"
        />

        <Select
          options={[
            {
              name: "preferred_project_length",
              value: "short",
              label: "짧음",
            },
            {
              name: "preferred_project_length",
              value: "medium",
              label: "보통",
            },
            {
              name: "preferred_project_length",
              value: "long",
              label: "길음",
            },
          ]}
          value={formData.preferredProjectLength}
          onChange={(value) => handleCollaborationPreferenceChange("preferredProjectLength", value as string)}
          placeholder="선호 프로젝트 기간을 선택해주세요"
          className="!w-full"
          label="선호 프로젝트 기간"
        />
      </div>
      <div className="flex justify-end">
        <SubmitBtn
          buttonText="변경하기"
          onClick={handleSubmit}
          submitStatus={submitStatus}
          fit
          withIcon
        />
      </div>
    </div>
  );
}