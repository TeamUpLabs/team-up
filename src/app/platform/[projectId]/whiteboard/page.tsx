'use client';

import Badge from "@/components/ui/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import IdeaList from "@/components/project/WhiteBoard/IdeaList";
import { useProject } from "@/contexts/ProjectContext";
import { Suspense } from "react";
import WhiteboardCreateModal from "@/components/project/WhiteBoard/whiteboardCreateModal";

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  </div>
);

export default function WhiteboardPage() {
  const { isDark } = useTheme();
  const { project } = useProject();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex active:scale-95"
        >
          <Badge
            content={
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                <span>아이디어 추가</span>
              </div>
            }
            color={isDark ? 'white' : 'black'}
            isDark={isDark}
            className="!px-4 !py-2 !font-semibold"
          />
        </button>
      </div>

      <ul className="space-y-4">
        {project?.whiteboards?.length === 0 ? (
          <p className="text-center text-text-secondary">
            아이디어가 없습니다.
          </p>
        ) : (
          project?.whiteboards?.map((whiteboard) => (
            <li key={whiteboard.id}>
              <IdeaList idea={whiteboard} />
            </li>
          ))
        )}
      </ul>

      <Suspense fallback={<LoadingSpinner />}>
        <WhiteboardCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Suspense>
    </div>
  );
}