"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { arrayMove } from '@dnd-kit/sortable';
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

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

// DraggableGrid is dynamically imported to avoid hydration mismatch
const DraggableGrid = dynamic(() => import('@/components/project/DraggableGrid'), { ssr: false });

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
      {/* DraggableGrid is only rendered on the client to avoid hydration mismatch */}
      <DraggableGrid
        cards={cards}
        activeId={activeId}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        setIsEditModalOpen={setIsEditModalOpen}
      />
    </div>
  );
}