'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import MilestoneCard from '@/components/project/milestone/MilestoneCard'
import { useProject } from '@/contexts/ProjectContext';
import MilestoneCreateModal from '@/components/project/milestone/MilestoneCreateModal';
import MilestoneModal from '@/components/project/milestone/MilestoneModal';
import { MileStone } from '@/types/MileStone';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/contexts/ThemeContext';
import TabSlider from '@/components/ui/TabSlider';

export default function MilestonePage() {
  const { project } = useProject();
  const [tab, setTab] = useState('all');

  const milestoneTabs = {
    'all': {
      label: '전체',
      count: project?.milestones?.length || 0
    },
    'not-started': {
      label: '시작 전',
      count: project?.milestones?.filter(milestone => milestone.status === 'not-started').length || 0
    },
    'in-progress': {
      label: '진행 중',
      count: project?.milestones?.filter(milestone => milestone.status === 'in-progress').length || 0
    },
    'done': {
      label: '완료됨',
      count: project?.milestones?.filter(milestone => milestone.status === 'done').length || 0
    }
  };
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MileStone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isDark } = useTheme();

  const filteredMilestones = project?.milestones.filter(milestone => {
    if (tab === 'all') return true;
    if (tab === 'not-started') return milestone.status === 'not-started';
    if (tab === 'in-progress') return milestone.status === 'in-progress';
    if (tab === 'done') return milestone.status === 'done';
    return true;
  }) ?? [];

  useEffect(() => {
    const selectedMilestoneId = localStorage.getItem('selectedMilestoneId');
    if (selectedMilestoneId && project?.milestones) {
      const milestone = project.milestones.find(
        m => m.id === parseInt(selectedMilestoneId)
      );
      if (milestone) {
        setSelectedMilestone(milestone);
        setIsModalOpen(true);
        localStorage.removeItem('selectedMilestoneId');
      }
    }
  }, [project]);

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex active:scale-95"
        >
          <Badge
            content={
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                <span>마일스톤 추가</span>
              </div>
            }
            color={isDark ? 'white' : 'black'}
            isDark={isDark}
            className="!px-4 !py-2 !font-semibold"
          />
        </button>
      </div>

      <TabSlider
        tabs={milestoneTabs}
        selectedTab={tab}
        onTabChange={setTab}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMilestones?.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
        {filteredMilestones?.length === 0 && (
          <div className="col-span-full text-center text-text-secondary">
            마일스톤이 없습니다.
          </div>
        )}
      </div>

      <MilestoneCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {selectedMilestone && (
        <MilestoneModal
          milestone={selectedMilestone}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMilestone(null);
          }}
        />
      )}
    </div>
  );
}