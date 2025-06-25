"use client";

import { useState } from "react";
import Link from "next/link";
import { server } from "@/auth/server";
import { useAuthStore } from "@/auth/authStore";
import { useProject } from "@/contexts/ProjectContext";
import { Github } from "flowbite-react-icons/solid";
import { Globe, Lock } from "flowbite-react-icons/outline";
import SubmitBtn from "@/components/ui/button/SubmitBtn";

interface CreateRepositoryData {
  repo_name: string;
  repo_description: string;
  isPrivate: boolean;
}

export default function GithubRepoCreate() {
  const { user } = useAuthStore((state) => state);
  const { project } = useProject();
  const [formData, setFormData] = useState<CreateRepositoryData>({
    repo_name: "",
    repo_description: "",
    isPrivate: false,
  });
  const [errors, setErrors] = useState<Partial<CreateRepositoryData>>({})
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (field: keyof CreateRepositoryData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  };

  // 저장소 이름 실시간 검증
  const handleNameChange = (value: string) => {
    // 소문자로 변환하고 공백을 하이픈으로 변경
    const formattedName = value.toLowerCase().replace(/\s+/g, "-")
    handleChange("repo_name", formattedName)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateRepositoryData> = {}

    // 저장소 이름 검증
    if (!formData.repo_name.trim()) {
      newErrors.repo_name = "저장소 이름을 입력해주세요."
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.repo_name)) {
      newErrors.repo_name = "저장소 이름은 영문, 숫자, '.', '_', '-'만 사용할 수 있습니다."
    } else if (formData.repo_name.length > 100) {
      newErrors.repo_name = "저장소 이름은 100자를 초과할 수 없습니다."
    }

    // 설명 검증 (선택사항이지만 길이 제한)
    if (formData.repo_description.length > 350) {
      newErrors.repo_description = "설명은 350자를 초과할 수 없습니다."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleConnect = async () => {
    if (!project?.id) return;

    if (!validateForm()) {
      return
    }

    setSubmitStatus('submitting');
    try {
      const res = await server.post(`project/${project?.id}/github/org/create-repo`, {
        ...formData,
        github_access_token: user?.github_access_token,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.github_access_token}`,
        },
      })

      if (res.status === 200) {
        setSubmitStatus('success');
        useAuthStore.getState().setAlert("레포지터리 생성 완료", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setSubmitStatus('error');
        useAuthStore.getState().setAlert("레포지터리 생성 실패", "error");
      }
    } catch (error) {
      console.log(error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("레포지터리 생성 실패", "error");
    }
  }

  return (
    <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-component-border bg-component-background p-6 rounded-lg space-y-6">
      <div className="text-center">
        <Github className="text-text-primary w-12 h-12 mb-2 justify-self-center" />
        <h1 className="text-2xl font-bold text-text-primary">Github 레포지터리 생성</h1>
        <p className="text-text-secondary mt-2">GitHub에 새로운 저장소를 생성합니다. 저장소 이름과 설정을 입력해주세요.</p>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="repo_name"
            className="flex items-center text-sm font-medium mb-2 text-text-secondary"
          >
            저장소 이름
          </label>
          <input
            type="text"
            id="repo_name"
            name="repo_name"
            value={formData.repo_name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover ${errors.repo_name ? "border-red-500" : ""}`}
            placeholder="my-awesome-project"
            required
          />
          {errors.repo_name && <p className="text-sm text-red-500">{errors.repo_name}</p>}
          <p className="text-xs text-text-secondary">
            저장소 이름은 영문 소문자, 숫자, 하이픈(-), 언더스코어(_), 점(.)을 사용할 수 있습니다.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="repo_description"
            className="flex items-center text-sm font-medium mb-2 text-text-secondary"
          >
            설명 (선택사항)
          </label>
          <textarea
            id="repo_description"
            name="repo_description"
            value={formData.repo_description}
            onChange={(e) => handleChange("repo_description", e.target.value)}
            className={`w-full resize-none px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover ${errors.repo_description ? "border-red-500" : ""}`}
            placeholder="이 저장소에 대한 간단한 설명을 입력하세요..."
            required
            rows={3}
            maxLength={350}
          />
          {errors.repo_description && <p className="text-sm text-red-500">{errors.repo_description}</p>}
          <p className="text-xs text-text-secondary">{formData.repo_description.length}/350자</p>
        </div>

        <div className="space-y-4">
          <label
            htmlFor="isPrivate"
            className="flex items-center text-sm font-medium mb-2 text-text-secondary"
          >
            저장소 공개 설정
          </label>
          <div className="space-y-2">
            <div className={`flex items-center justify-between p-4 border border-component-border rounded-lg transition-all duration-200 ${!formData.isPrivate ? "border-green-500" : ""}`}>
              <div className="flex items-center gap-3">
                <Globe className="w-7 h-7 text-green-600" />
                <div className="flex flex-col">
                  <h4 className="font-medium">공개 (Public)</h4>
                  <p className="text-sm text-text-secondary">누구나 이 저장소를 볼 수 있습니다</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPrivate"
                  className="sr-only peer"
                  checked={!formData.isPrivate}
                  onChange={() => handleChange("isPrivate", false)}
                />
                <div className="w-11 h-6 bg-component-tertiary-background rounded-full peer peer-checked:bg-point-color-indigo peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className={`flex items-center justify-between p-4 border border-component-border rounded-lg transition-all duration-200 ${formData.isPrivate ? "border-orange-500" : ""}`}>
              <div className="flex items-center gap-3">
                <Lock className="w-7 h-7 text-orange-600" />
                <div className="flex flex-col">
                  <h4 className="font-medium">비공개 (Private)</h4>
                  <p className="text-sm text-text-secondary">초대받은 사용자만 이 저장소를 볼 수 있습니다</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPrivate"
                  className="sr-only peer"
                  checked={formData.isPrivate}
                  onChange={() => handleChange("isPrivate", true)}
                />
                <div className="w-11 h-6 bg-component-tertiary-background rounded-full peer peer-checked:bg-point-color-indigo peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="preview"
            className="flex items-center text-sm font-medium mb-2 text-text-secondary"
          >
            미리보기
          </label>
          <div id="preview" className="w-full flex items-center gap-2 p-4 border border-component-border rounded-lg bg-component-background">
            <Github />
            <Link
              href="https://github.com/TeamUpLabs"
              target="_blank"
              className="hover:underline"
            >
              <span className="font-medium text-text-primary">TeamUpLabs</span>
            </Link>
            <span>/</span>
            <span className="font-medium text-text-primary">{formData.repo_name || "repository-name"}</span>
            {formData.isPrivate ? (
              <Lock className="text-orange-600" />
            ) : (
              <Globe className="text-green-600" />
            )}
          </div>
        </div>
        <SubmitBtn
          onClick={handleConnect}
          submitStatus={submitStatus}
          buttonText="저장소 생성"
          successText="저장소 생성 완료"
          errorText="오류 발생"
          fit
          withIcon
        />
      </div>
    </div>
  )
}