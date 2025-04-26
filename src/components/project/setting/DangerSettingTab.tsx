import { useState } from "react";
import DeleteProjectConfirmModal from "@/components/project/setting/DeleteProjectConfirmModal";

export default function DangerSettingTab() {
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);

  return (
    <div className="p-6 border border-red-500 rounded-lg bg-red-500/10">
      <h2 className="text-xl font-semibold text-red-500">위험 구역</h2>
      <p className="text-text-secondary my-2">이 작업은 되돌릴 수 없습니다. 신중하게 진행하세요.</p>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-text-primary">프로젝트 보관</h3>
          <p className="text-text-secondary text-sm mb-3">프로젝트를 보관처리하면 접근은 가능하지만 더 이상 수정할 수 없습니다.</p>
          <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
            프로젝트 보관
          </button>
        </div>

        <div className="pt-6 border-t border-component-border">
          <h3 className="text-lg font-medium text-text-primary">프로젝트 삭제</h3>
          <p className="text-text-secondary text-sm mb-3">프로젝트와 모든 관련 데이터가 영구적으로 삭제됩니다.</p>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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