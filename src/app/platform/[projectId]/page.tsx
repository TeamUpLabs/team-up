"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

import ProjectProgressCard from "@/components/project/ProjectProgressCard";
import MileStoneCard from "@/components/project/MileStoneCard";
import TeamActivities from "@/components/project/TeamActivities";
import RecentFileCard from "@/components/project/RecentFileCard";
import Activity from "@/components/project/Activity";
import RecentTask from "@/components/project/RecentTask";
import Schedule from "@/components/project/Schedule";
import EditWidgetsModal from "@/components/project/EditWidgetsModal";

// Define the structure for our card items
interface CardItemType {
  id: string;
  component: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
}

const LOCAL_STORAGE_KEY = 'projectPageCardOrder';
const LOCAL_STORAGE_ACTIVE_CARDS_KEY = 'projectPageActiveCards';

// Helper component to make items sortable
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ scale: 1 }}
      animate={{
        scale: isDragging ? 1.02 : 1,
        opacity: isDragging ? 0.85 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-lg ${isDragging ? 'shadow-xl' : ''} break-inside-avoid-column`}
    >
      <div className="group relative transition-all duration-300 ease-in-out">
        <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div
            {...attributes}
            {...listeners}
            className="bg-blue-50 hover:bg-blue-100 rounded-full w-8 h-8 shadow-md flex items-center justify-center cursor-move transition-all duration-200 hover:scale-110"
            title="드래그하여 카드 위치 조정"
          >
            <FontAwesomeIcon icon={faGripVertical} className="text-blue-500" size="sm" />
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

export default function ProjectPage() {
  const initialCardsMaster: CardItemType[] = [
    { id: '1', component: <ProjectProgressCard />, title: '프로젝트 진행률', description: '프로젝트의 전체 진행 상황을 표시합니다', active: true },
    { id: '2', component: <MileStoneCard />, title: '마일스톤', description: '주요 마일스톤 진행 상황을 보여줍니다', active: true },
    { id: '3', component: <TeamActivities />, title: '팀 활동', description: '팀원들의 최근 활동 내역을 표시합니다', active: true },
    { id: '4', component: <RecentFileCard />, title: '최근 파일', description: '최근에 업로드된 파일 목록을 표시합니다', active: true },
    { id: '5', component: <Activity />, title: '일별 활동량', description: '일별 활동량 통계를 그래프로 보여줍니다', active: true },
    { id: '6', component: <RecentTask />, title: '최근 작업', description: '최근 생성되거나 업데이트된 작업을 표시합니다', active: true },
    { id: '7', component: <Schedule />, title: '일정', description: '프로젝트의 주요 일정을 달력 형태로 보여줍니다', active: true },
  ];

  const [cards, setCards] = useState<CardItemType[]>(() => {
    // Initialize state from localStorage or default
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      // Get saved card order
      const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY);
      // Get saved active cards state
      const savedActiveCards = localStorage.getItem(LOCAL_STORAGE_ACTIVE_CARDS_KEY);

      let orderedCards = [...initialCardsMaster]; // Default to master list
      
      // Apply saved order if available
      if (savedOrder) {
        try {
          const orderedIds = JSON.parse(savedOrder) as string[];
          // Reorder initialCardsMaster based on saved IDs
          orderedCards = orderedIds
            .map(id => initialCardsMaster.find(card => card.id === id))
            .filter(Boolean) as CardItemType[];
          
          // Ensure all master cards are present, add any missing ones to the end
          const currentIds = new Set(orderedCards.map(c => c.id));
          initialCardsMaster.forEach(masterCard => {
            if (!currentIds.has(masterCard.id)) {
              orderedCards.push(masterCard);
            }
          });
        } catch (error) {
          console.error("Failed to parse card order from localStorage:", error);
          orderedCards = [...initialCardsMaster]; // Fallback to default
        }
      }

      // Apply saved active states if available
      if (savedActiveCards) {
        try {
          const activeCardIds = new Set(JSON.parse(savedActiveCards) as string[]);
          // Update active state for all cards based on saved active state
          orderedCards = orderedCards.map(card => ({
            ...card,
            active: activeCardIds.has(card.id)
          }));
        } catch (error) {
          console.error("Failed to parse active cards from localStorage:", error);
        }
      }
      
      return orderedCards;
    }
    return initialCardsMaster; // Default order
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Effect to save to localStorage when cards change
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      // Save card order
      const cardIds = cards.map(card => card.id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cardIds));
      
      // Save active cards
      const activeCardIds = cards.filter(card => card.active).map(card => card.id);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_CARDS_KEY, JSON.stringify(activeCardIds));
    }
  }, [cards]);


  
  // Function to toggle card active state
  const toggleCardActive = (id: string) => {
    setCards(currentCards => 
      currentCards.map(card => 
        card.id === id ? { ...card, active: !card.active } : card
      )
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Small threshold to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    // Add a subtle haptic feedback on mobile if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // localStorage will be updated by the useEffect hook
        return newItems;
      });
      // Add a subtle haptic feedback on mobile if available
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([50, 50, 50]);
      }
    }
  }

  return (
    <div className="relative">
      {/* Edit Widgets Modal */}
      <EditWidgetsModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        availableCards={cards}
        onToggleCard={toggleCardActive}
      />
      
      {/* Action Buttons */}
      <div className="fixed right-6 bottom-6 z-20 flex flex-col space-y-3">
        {/* Edit Widgets Button */}
        <motion.button
          onClick={() => setIsEditModalOpen(true)}
          className="flex bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="위젯 편집"
        >
          <FontAwesomeIcon icon={faPencilAlt} size="lg" />
        </motion.button>
        

      </div>



      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cards.map(card => card.id)} strategy={rectSortingStrategy}>
          <div className="py-24 md:py-20 px-4">
            <div className="columns-1 md:columns-1 lg:columns-2 xl:columns-2 gap-6">
              <AnimatePresence>
                {cards.filter(card => card.active).map((card) => (
                  <SortableItem key={card.id} id={card.id}>
                    <motion.div
                      className="break-inside-avoid-column hover:shadow-md transition-shadow duration-300 mb-6"
                      layoutId={card.id}
                    >
                      {card.component}
                    </motion.div>
                  </SortableItem>
                ))}
              </AnimatePresence>
              
              {/* Empty State - No active widgets */}
              {cards.filter(card => card.active).length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <div className="text-center">
                    <div className="mb-4 rounded-full bg-blue-100 p-6 inline-flex dark:bg-blue-900/30">
                      <FontAwesomeIcon icon={faPlus} className="text-blue-500 dark:text-blue-400" size="2x" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">위젯이 없습니다</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">아래 편집 버튼을 클릭하여 위젯을 추가해보세요.</p>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                      위젯 편집
                    </button>
                  </div>
                </div>
              )}
              
              {/* Add Widget Button - shown when there's at least one widget */}
              {cards.filter(card => card.active).length > 0 && cards.some(card => !card.active) && (
                <motion.div 
                  className="col-span-1 border-2 border-dashed border-component-border hover:border-component-border-hover bg-component-secondary-background rounded-xl flex items-center justify-center p-12 cursor-pointer transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <div className="text-center">
                    <div className="mb-3 rounded-full bg-component-border p-4 inline-flex">
                      <FontAwesomeIcon icon={faPlus} className="text-blue-500" />
                    </div>
                    <p className="text-component-text-secondary">위젯 추가</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </SortableContext>

        {/* Show overlay of the currently dragged item */}
        <DragOverlay adjustScale={true} zIndex={100}>
          {activeId ? (
            <div className="opacity-90 rounded-lg shadow-2xl">
              {cards.find(card => card.id === activeId)?.component}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}