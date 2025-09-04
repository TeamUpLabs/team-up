'use client'

import { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useProject } from '@/contexts/ProjectContext';
import { MileStone } from '@/types/MileStone';
import Badge from '@/components/ui/Badge';
import TabSlider from '@/components/ui/TabSlider';
import { useTheme } from "@/contexts/ThemeContext";

// 지연 로딩을 위한 컴포넌트들
const MilestoneCard = lazy(() => import('@/components/project/milestone/MilestoneCard'));
const MilestoneCreateModal = lazy(() => import('@/components/project/milestone/MilestoneCreateModal'));
const MilestoneModal = lazy(() => import('@/components/project/milestone/MilestoneModal'));

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  </div>
);

// 스켈레톤 카드 컴포넌트
const SkeletonCard = () => (
  <div className="bg-component-tertiary-background animate-pulse rounded-lg h-32"></div>
);

export default function MilestonePage() {
  const { project } = useProject();
  const { isDark } = useTheme();
  const [tab, setTab] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MileStone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // 메모이제이션을 통한 탭 데이터 최적화
  const milestoneTabs = useMemo(() => ({
    'all': {
      label: '전체',
      count: project?.milestones?.length || 0
    },
    'not_started': {
      label: '시작 전',
      count: project?.milestones?.filter(milestone => milestone.status === 'not_started').length || 0
    },
    'in_progress': {
      label: '진행 중',
      count: project?.milestones?.filter(milestone => milestone.status === 'in_progress').length || 0
    },
    'completed': {
      label: '완료됨',
      count: project?.milestones?.filter(milestone => milestone.status === 'completed').length || 0
    }
  }), [project?.milestones]);

  // 디바운스된 검색 함수
  const debouncedSetSearchQuery = useCallback((value: string) => {
    const timeoutId = setTimeout(() => setSearchQuery(value), 300);
    return () => clearTimeout(timeoutId);
  }, []);

  // Listen for header search events
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || '';

      // 디바운스된 검색 적용
      debouncedSetSearchQuery(searchValue);
    };

    window.addEventListener('headerSearch', handleHeaderSearch);

    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch);
    };
  }, [debouncedSetSearchQuery]);

  // 메모이제이션을 통한 필터링 최적화
  const filteredMilestones = useMemo(() => {
    return project?.milestones.filter(milestone => {
      const matchesTab = 
        tab === 'all' || 
        (milestone.status === tab);
      
      // If there's no search query, just return tab matches
      if (!searchQuery.trim()) return matchesTab;

      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        milestone.title.toLowerCase().includes(searchLower) ||
        milestone.description?.toLowerCase().includes(searchLower) ||
        milestone.assignees?.some(assignee => assignee.name.toLowerCase().includes(searchLower));

      return matchesTab && matchesSearch;
    }) ?? [];
  }, [project?.milestones, tab, searchQuery]);

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
    <div className="flex flex-col gap-4">
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
        {filteredMilestones.length === 0 ? (
          <div className="col-span-full text-center text-text-secondary">
            마일스톤이 없습니다.
          </div>
        ) : (
          filteredMilestones.map((milestone) => (
            <Suspense key={milestone.id} fallback={<SkeletonCard />}>
              <MilestoneCard milestone={milestone} />
            </Suspense>
          ))
        )}
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <MilestoneCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </div>
  );
}