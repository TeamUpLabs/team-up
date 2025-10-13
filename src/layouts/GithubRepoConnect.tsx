import { Input } from "@/components/ui/Input";
import { useState, useEffect, useCallback } from "react";
import { Github } from "flowbite-react-icons/solid";
import { CheckCircle, Loader2, X, Check } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { server } from "@/auth/server";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";

interface GithubRepoConnectProps {
  setIsGithubRepoCreated: (value: boolean) => void;
}

export default function GithubRepoConnect({
  setIsGithubRepoCreated,
}: GithubRepoConnectProps) {
  const { project } = useProject();
  const [repoUrl, setRepoUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // GitHub URL 형식 검사 함수
  const isValidGithubUrl = (url: string): boolean => {
    const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+\/?$/;
    return githubUrlPattern.test(url);
  };

  // GitHub 저장소 존재 확인 함수
  const checkGithubRepo = async (url: string) => {
    try {
      // URL에서 owner와 repo 추출
      const urlParts = url.replace('https://github.com/', '').split('/');
      const owner = urlParts[0];
      const repo = urlParts[1]?.replace(/\/$/, ''); // trailing slash 제거

      if (!owner || !repo) {
        throw new Error("잘못된 GitHub URL 형식입니다.");
      }

      // GitHub API 호출
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

      if (response.ok) {
        const repoData = await response.json();
        return {
          isValid: true,
          message: `${repoData.full_name} 저장소가 확인되었습니다.`,
          data: repoData
        };
      } else if (response.status === 404) {
        return {
          isValid: false,
          message: "GitHub 저장소를 찾을 수 없습니다."
        };
      } else {
        throw new Error(`API 오류: ${response.status}`);
      }
    } catch (error) {
      return {
        isValid: false,
        message: error instanceof Error ? error.message : "저장소 확인 중 오류가 발생했습니다."
      };
    }
  };

  // 디바운스된 검사 함수
  const debouncedValidation = useCallback(async (url: string) => {
    if (!url) {
      setIsValid(null);
      setValidationMessage("");
      return;
    }

    if (!isValidGithubUrl(url)) {
      setIsValid(false);
      setValidationMessage("올바른 GitHub URL 형식이 아닙니다.");
      return;
    }

    setIsValidating(true);
    setIsValid(null);

    // API 호출 전에 잠시 대기 (디바운스)
    setTimeout(async () => {
      const result = await checkGithubRepo(url);
      setIsValid(result.isValid);
      setValidationMessage(result.message);
      setIsValidating(false);
    }, 1000);
  }, []);

  // URL 변경시 검사 실행
  useEffect(() => {
    debouncedValidation(repoUrl);
  }, [repoUrl, debouncedValidation]);

  const handleConnect = async () => {
    if (repoUrl == "") {
      useAuthStore.getState().setAlert("저장소 URL을 입력해주세요.", "error");
      return;
    }

    if (!isValid) {
      useAuthStore.getState().setAlert("올바른 저장소 URL을 입력해주세요.", "error");
      return;
    }

    setSubmitStatus('submitting');
    try {
      const res = await server.put(`/api/v1/projects/${project?.id}`, {
        github_url: [repoUrl],
      })

      if (res.status === 200) {
        setSubmitStatus('success');
        useAuthStore.getState().setAlert("레포지터리 연결 완료", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setSubmitStatus('error');
        useAuthStore.getState().setAlert("레포지터리 연결 실패", "error");
      }
    } catch (error) {
      console.log(error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("레포지터리 연결 실패", "error");
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto p-6 rounded-lg space-y-6">
      <div className="text-center">
        <Github className="text-text-primary w-12 h-12 mb-2 justify-self-center" />
        <h1 className="text-2xl font-bold text-text-primary">Github 레포지터리 연결</h1>
        <p className="text-text-secondary mt-2">GitHub에 저장소를 연결합니다.</p>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <Input
            label="저장소 URL"
            placeholder="https://github.com/username/repository"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            isRequired
          />

          {/* 검사 결과 표시 */}
          {repoUrl && (
            <Badge
              content={
                <div className="flex items-center gap-2">
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>저장소 확인 중...</span>
                    </>
                  ) : isValid === true ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{validationMessage}</span>
                    </>
                  ) : isValid === false ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{validationMessage}</span>
                    </>
                  ) : null}
                </div>
              }
              color={
                isValidating
                  ? "blue"
                  : isValid === true
                    ? "green"
                    : isValid === false
                      ? "red"
                      : "gray"
              }
            />
          )}
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
            <span className="font-medium text-text-primary">{repoUrl.split("/")[3] || "username"}</span>
            <span>/</span>
            {isValid === true ? (
              <Link
                href={repoUrl}
                target="_blank"
                className="hover:underline"
              >
                <span className="font-medium text-text-primary">{repoUrl.split("/")[4] || "repository-name"}</span>
              </Link>
            ) : (
              <span className="font-medium text-text-primary">{repoUrl.split("/")[4] || "repository-name"}</span>
            )}
            {isValid === false || isValid === null ? (
              <X className="text-orange-600" />
            ) : (
              <Check className="text-green-600" />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <SubmitBtn
          onClick={handleConnect}
          submitStatus={submitStatus}
          buttonText="저장소 연결"
          successText="저장소 연결 완료"
          errorText="오류 발생"
          fit
          withIcon
        />

        <button
          onClick={() => setIsGithubRepoCreated(false)}
          className="text-sm text-text-primary hover:underline hover:text-point-color-indigo cursor-pointer"
        >
          저장소가 없나요?
        </button>
      </div>
    </div>
  );
}