"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface CardItemType {
  id: string;
  component: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
}

interface DraggableGridProps {
  cards: CardItemType[];
  activeId: string | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  setIsEditModalOpen: (open: boolean) => void;
} 

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

const DraggableGrid: React.FC<DraggableGridProps> = ({
  cards,
  activeId,
  onDragStart,
  onDragEnd,
  setIsEditModalOpen,
}) => {
  // DnD sensors must be created with hooks at the top of the component
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
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
  );
};

export default DraggableGrid;
