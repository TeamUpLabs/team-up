import ModalTemplete from "@/components/ModalTemplete";
import { Presentation } from "lucide-react";
import TabSlider from "@/components/ui/TabSlider";
import { useState } from "react";
import Document from "@/components/project/WhiteBoard/Document";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";

interface WhiteboardCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhiteboardCreateModal({
  isOpen,
  onClose,
}: WhiteboardCreateModalProps) {
  const [tab, setTab] = useState('document');
  const WhiteboardTabs = {
    'document': {
      label: '문서',
    },
    'canvas': {
      label: '캔버스',
    },
  }

  const modalHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <Presentation
          className="text-text-primary text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          화이트 보드 생성
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          프로젝트 화이트 보드를 관리하세요
        </p>
      </div>
    </div>
  )

  const modalFooter = (
    <div className="flex justify-end space-x-3 pt-4">
      <CancelBtn
        handleCancel={onClose}
        withIcon
      />
      <SubmitBtn
        submitStatus="idle"
        buttonText="저장하기"
        withIcon
        fit
      />
    </div>
  )
  return (
    <ModalTemplete
      header={modalHeader}
      isOpen={isOpen}
      onClose={onClose}
      footer={modalFooter}
    >
      <div className="space-y-2">
        <TabSlider
          tabs={WhiteboardTabs}
          selectedTab={tab}
          onTabChange={setTab}
          fullWidth
        />
        {tab === 'document' && (
          <div>
            <Document />
          </div>
        )}
        {tab === 'canvas' && (
          <div>
            <p>캔버스 탭</p>
          </div>
        )}
      </div>
    </ModalTemplete>
  );
}