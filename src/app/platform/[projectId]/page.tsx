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
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy, // Or verticalListSortingStrategy / horizontalListSortingStrategy if preferred
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ProjectProgressCard from "@/components/project/ProjectProgressCard";
import MileStoneCard from "@/components/project/MileStoneCard";
import TeamActivities from "@/components/project/TeamActivities";
import RecentFileCard from "@/components/project/RecentFileCard";
import Activity from "@/components/project/Activity";

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
    zIndex: isDragging ? 10 : undefined, // Ensure dragging item is on top
    // opacity: isDragging ? 0.5 : 1, // Optional: visual feedback while dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function ProjectPage() {
  const initialCardsMaster: CardItemType[] = [
    { id: '1', component: <ProjectProgressCard /> },
    { id: '2', component: <MileStoneCard /> },
    { id: '3', component: <TeamActivities /> },
    { id: '4', component: <RecentFileCard /> },
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

  // Effect to save to localStorage when cards change
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
        const cardIds = cards.map(card => card.id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cardIds));
    }
  }, [cards]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // localStorage will be updated by the useEffect hook
        return newItems;
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards.map(card => card.id)} strategy={rectSortingStrategy}>
        <div className="py-20 px-4">
          {/* 모바일에서는 1열, 태블릿에서 2열, 데스크탑에서 2열 */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {cards.map((card) => (
              <SortableItem key={card.id} id={card.id}>
                {/* Conditional styling based on card type if needed for specific grid spans */}
                {/* Example: card.id === '1' (ProjectProgressCard) might need col-span-2 on mobile */}
                {/* For simplicity, all cards currently take default grid cell behavior */}
                {/* You might need to adjust className here based on card.id if spans are dynamic based on card type */}
                <div className={`${card.id === '1' ? 'sm:col-span-1 lg:col-span-1' : ''} ${card.id === '2' ? 'sm:col-span-1 lg:col-span-1' : ''} ${card.id === '3' ? 'sm:col-span-1 lg:col-span-1' : ''} ${card.id === '4' ? 'sm:col-span-1 lg:col-span-1' : ''} `}>
                  {card.component}
                </div>
              </SortableItem>
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}