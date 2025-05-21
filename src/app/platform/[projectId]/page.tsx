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
import { faGripVertical, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

import ProjectProgressCard from "@/components/project/ProjectProgressCard";
import MileStoneCard from "@/components/project/MileStoneCard";
import TeamActivities from "@/components/project/TeamActivities";
import RecentFileCard from "@/components/project/RecentFileCard";
import Activity from "@/components/project/Activity";
import RecentTask from "@/components/project/RecentTask";
import Schedule from "@/components/project/Schedule";

// Define the structure for our card items
interface CardItemType {
  id: string;
  component: React.ReactNode;
}

const LOCAL_STORAGE_KEY = 'projectPageCardOrder';

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
      className={`relative rounded-lg ${isDragging ? 'shadow-xl' : ''}`}
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
    { id: '1', component: <ProjectProgressCard /> },
    { id: '2', component: <MileStoneCard /> },
    { id: '3', component: <TeamActivities /> },
    { id: '4', component: <RecentFileCard /> },
    { id: '5', component: <Activity /> },
    { id: '6', component: <RecentTask /> },
    { id: '7', component: <Schedule /> },
  ];

  const [cards, setCards] = useState<CardItemType[]>(() => {
    // Initialize state from localStorage or default
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedOrder) {
        try {
          const orderedIds = JSON.parse(savedOrder) as string[];
          // Reorder initialCardsMaster based on saved IDs
          const orderedCards = orderedIds.map(id => initialCardsMaster.find(card => card.id === id)).filter(Boolean) as CardItemType[];
          // Ensure all master cards are present, add any missing ones to the end
          const currentIds = new Set(orderedCards.map(c => c.id));
          initialCardsMaster.forEach(masterCard => {
            if (!currentIds.has(masterCard.id)) {
              orderedCards.push(masterCard);
            }
          });
          return orderedCards;
        } catch (error) {
          console.error("Failed to parse card order from localStorage:", error);
          // Fallback to default if parsing fails
          return initialCardsMaster;
        }
      }
    }
    return initialCardsMaster; // Default order
  });
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showResetButton, setShowResetButton] = useState(false);
  const [resetTooltip, setResetTooltip] = useState(false);

  // Check if current order differs from default to show reset button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY);
      setShowResetButton(!!savedOrder);
    }
  }, [cards]);

  // Effect to save to localStorage when cards change
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      const cardIds = cards.map(card => card.id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cardIds));
    }
  }, [cards]);

  // Function to reset cards to original order
  const resetCardOrder = () => {
    setCards(initialCardsMaster);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setShowResetButton(false);
    
    // Show success animation/notification
    const notification = document.getElementById('reset-notification');
    if (notification) {
      notification.classList.remove('hidden');
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 3000);
    }
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
      setShowResetButton(true);
      
      // Add a subtle haptic feedback on mobile if available
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([50, 50, 50]);
      }
    }
  }

  return (
    <div className="relative">
      {/* Reset Layout Button */}
      {showResetButton && (
        <div className="fixed right-6 bottom-6 z-20" 
             onMouseEnter={() => setResetTooltip(true)}
             onMouseLeave={() => setResetTooltip(false)}>
          <motion.button
            onClick={resetCardOrder}
            className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faRotateLeft} size="lg" />
          </motion.button>
          
          {/* Tooltip */}
          <AnimatePresence>
            {resetTooltip && (
              <motion.div 
                className="absolute right-12 bottom-3 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                원래 배치로 초기화
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Reset Success Notification */}
      <div id="reset-notification" className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md hidden z-50 transition-all duration-300">
        카드 배치가 초기화되었습니다
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cards.map(card => card.id)} strategy={rectSortingStrategy}>
          <div className="py-20 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <AnimatePresence>
                {cards.map((card) => (
                  <SortableItem key={card.id} id={card.id}>
                    <motion.div 
                      className="col-span-1 hover:shadow-md transition-shadow duration-300"
                      layoutId={card.id}
                    >
                      {card.component}
                    </motion.div>
                  </SortableItem>
                ))}
              </AnimatePresence>
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