import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import ModalTemplete from '@/components/ModalTemplete';
import ActivitySkeleton from '@/components/skeleton/ActivitySkeleton';
import MilestoneCardSkeleton from '@/components/skeleton/MilestoneCardSkeleton';
import RecentFileSkeleton from '@/components/skeleton/RecentFileSkeleton';
import ProjectProgressCardSkeleton from '@/components/skeleton/ProjectProgressCardSkeleton';
import ScheduleSkeleton from '@/components/skeleton/ScheduleSkeleton';
import TeamActivitiesSkeleton from '@/components/skeleton/TeamActivitiesSkeleton';
import RecentTaskSkeleton from '@/components/skeleton/RecentTaskSkeleton';

interface CardItem {
  id: string;
  title: string;
  active: boolean;
  description: string;
}

interface EditWidgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCards: CardItem[];
  onToggleCard: (id: string) => void;
}

const EditWidgetsModal: React.FC<EditWidgetsModalProps> = ({
  isOpen,
  onClose,
  availableCards,
  onToggleCard,
}) => {
  // 모달 헤더 컴포넌트
  const modalHeader = (
    <h3 className="text-xl font-semibold text-text-primary">위젯 편집</h3>
  );

  // 모달 푸터 컴포넌트
  const modalFooter = (
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
      >
        완료
      </button>
    </div>
  );

  // 위젯별 스켈레톤 로딩 미리보기 렌더링 함수
  const renderWidgetSkeleton = (cardId: string) => {
    switch(cardId) {
      case '1': // 프로젝트 진행률
        return (
          <ProjectProgressCardSkeleton isPreview={true} /> 
        );
      
      case '2': // 마일스톤
        return (
          <MilestoneCardSkeleton isPreview={true} />
        );
      
      case '3': // 팀 활동
        return (
          <TeamActivitiesSkeleton isPreview={true} />
        );
      
      case '4': // 최근 파일
        return (
          <RecentFileSkeleton isPreview={true} />
        );
      
      case '5': // 일별 활동량
        return (
          <ActivitySkeleton isPreview={true} />
        );
      
      case '6': // 최근 작업
        return (
          <RecentTaskSkeleton isPreview={true} />
        );
      
      case '7': // 일정
        return (
          <ScheduleSkeleton isPreview={true} />
        );
      
      default:
        return null;
    }
  };

  // 모달 내용 컴포넌트
  const modalContent = (
    <div className="space-y-6">
      <p className="text-text-secondary">
        표시할 위젯을 선택하세요. 위젯을 드래그하여 위치를 변경할 수 있습니다.
      </p>
      
      <div className="grid gap-4">
        {availableCards.map((card) => (
          <motion.div 
            key={card.id}
            className={`border rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 transition-all cursor-pointer ${
              card.active 
                ? 'border-blue-200 bg-component-secondary-background' 
                : 'border-component-border bg-component-secondary-background'
            }`}
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggleCard(card.id)}
          >
            <div className="md:col-span-2">
              <h4 className={`font-medium ${card.active ? 'text-blue-700' : 'text-gray-800'}`}>
                {card.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {card.description}
              </p>
              <div className="mt-3 flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  card.active 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <FontAwesomeIcon 
                    icon={card.active ? faMinus : faPlus} 
                    size="xs" 
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {card.active ? '위젯 제거' : '위젯 추가'}
                </span>
              </div>
            </div>
            
            <div className="relative border border-component-border rounded-lg overflow-hidden">
              {renderWidgetSkeleton(card.id)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={modalHeader}
      footer={modalFooter}
    >
      {modalContent}
    </ModalTemplete>
  );
};

export default EditWidgetsModal;
