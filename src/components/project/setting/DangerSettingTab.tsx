import { useState } from "react";
import DeleteProjectConfirmModal from "@/components/project/setting/DeleteProjectConfirmModal";

export default function DangerSettingTab() {
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);

  return (
    <div className="p-6 border border-red-500 rounded-lg bg-red-500/10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-red-500">위험 구역</h2>
        <p className="mt-1 text-sm text-text-secondary">
          이 작업은 되돌릴 수 없으니 신중하게 진행하세요.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">프로젝트 삭제</h3>
            <p className="text-sm text-text-secondary">
              프로젝트와 모든 관련 데이터가 영구적으로 삭제됩니다. 이 작업은
              되돌릴 수 없습니다.
            </p>
          </div>
          <button
            className="ml-4 flex-shrink-0 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
            onClick={() => setIsDeleteProjectModalOpen(true)}
          >
            프로젝트 삭제
          </button>
        </div>
      </div>

      {isDeleteProjectModalOpen && (
        <DeleteProjectConfirmModal
          isOpen={isDeleteProjectModalOpen}
          onClose={() => setIsDeleteProjectModalOpen(false)}
        />
      )}
    </div>
  );
}