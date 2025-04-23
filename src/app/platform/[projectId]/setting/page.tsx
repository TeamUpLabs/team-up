"use client";

import { useAuthStore } from "@/auth/authStore";
import { useProject } from "@/contexts/ProjectContext";
import { deleteProject } from "@/hooks/getProjectData";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { project } = useProject();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const isLeader = Array.isArray(project?.leader)
    ? project.leader.some((leader: { id: number | string }) => leader.id === user?.id)
    : project?.leader?.id === user?.id;

  const handleDeleteProject = async () => {
    if (project) {
      useAuthStore.getState().setConfirm("정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.", async () => {
        await deleteProject(project.id);
        useAuthStore.getState().setConfirm("");
        useAuthStore.getState().setAlert("프로젝트가 삭제되었습니다.", "success");
        router.push('/platform');
      })
    }
  }

  return (
    <div className="py-6 px-2 sm:px-4 md:px-6">
      <div className="rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-100">설정</h1>
        <p className="text-gray-400 mt-2">여기에서 프로젝트 설정을 관리하세요.</p>
        {isLeader && (
          <div className="mt-6 p-4 border border-red-500 rounded-lg bg-red-500/10">
            <h2 className="text-xl font-semibold text-red-500">위험 구역</h2>
            <p className="text-gray-400 my-2">이 작업은 되돌릴 수 없습니다. 신중하게 진행하세요.</p>
            <button 
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              onClick={handleDeleteProject}
            >
              프로젝트 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}