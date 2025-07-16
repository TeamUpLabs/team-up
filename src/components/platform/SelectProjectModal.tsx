import { useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { Project } from "@/types/Project";
import { sendScout } from "@/hooks/getMemberData";
import ModalTemplete from "@/components/ModalTemplete";
import useAuthHydration from "@/hooks/useAuthHydration";
import { fetcher } from "@/auth/server";
import useSWR from "swr";

interface SelectProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToScout?: {
    id: number;
    name: string;
  }
}

export default function SelectProjectModal({ isOpen, onClose, memberToScout }: SelectProjectModalProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthHydration();

  const { data: projects, isLoading } = useSWR<Project[]>(
    hydrated && user?.id ? `/users/${user.id}/projects` : null,
    fetcher
  );

  const handleScout = async () => {
    if (!selectedProject || !memberToScout) return;

    try {
      if (!user) return;
      setIsSubmitting(true);
      await sendScout(selectedProject, projects?.find((p: Project) => p.id === selectedProject)?.title ?? "", memberToScout.id);
      useAuthStore.getState().setAlert(`${memberToScout.name}님을 프로젝트에 스카우트했습니다!`, "success");
      onClose();
    } catch (error) {
      console.error("Error scouting member:", error);
      useAuthStore.getState().setAlert("스카우트 처리 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const header = (
    <div className="flex items-center space-x-4">
      <h2 className="text-xl font-bold text-text-primary">프로젝트 선택</h2>
    </div>
  );

  const content = (
    <div className="flex-1 overflow-y-auto">
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-text-secondary">프로젝트를 불러오는 중...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {(() => {
            const availableProjects = (projects || []).filter((project: Project) => {
              const isScoutTargetMember = project.members?.some(member => member.user.id === memberToScout?.id);
              return !isScoutTargetMember;
            });

            if (availableProjects.length === 0) {
              return (
                <div className="py-8 text-center text-text-secondary">
                  <p>스카우트 가능한 프로젝트가 없습니다.</p>
                  <p className="mt-2 text-sm">이 사용자는 이미 모든 프로젝트에 참여 중이거나, 참여할 수 있는 프로젝트가 없습니다.</p>
                </div>
              );
            }

            return availableProjects.map((project: Project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`p-4 rounded-lg border ${
                  selectedProject === project.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-component-border hover:border-component-border-hover hover:bg-component-secondary-background"
                } cursor-pointer transition-all`}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium ${selectedProject === project.id ? "text-blue-400" : "text-text-primary"}`}>
                    {project.title}
                  </h3>
                  {selectedProject === project.id && (
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm text-text-secondary">{project.description}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags?.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-md text-xs bg-component-secondary-background text-text-secondary">
                      {tag}
                    </span>
                  ))}
                  {project.tags?.length > 3 && (
                    <span className="px-2 py-1 rounded-md text-xs bg-component-secondary-background text-text-secondary">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-lg border border-component-border text-text-secondary hover:bg-component-secondary-background transition-colors active:scale-95"
      >
        취소
      </button>
      <button
        type="button"
        disabled={!selectedProject || isSubmitting}
        onClick={handleScout}
        className={`px-4 py-2 rounded-lg ${!selectedProject
            ? "bg-blue-500/30 text-blue-300/70 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
          } transition-colors flex items-center active:scale-95`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            처리 중...
          </>
        ) : (
          "스카우트하기"
        )}
      </button>
    </div>
  );

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      footer={footer}
    >
      {content}
    </ModalTemplete>
  );
}