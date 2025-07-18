"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableQuestionClient } from "./draggable-question-client";
import { DraggableQuestion, useDragDrop } from "./drag-drop-context";

interface DraggableSectionClientProps {
  questions: DraggableQuestion[];
  isFixed?: boolean;
}

export const DraggableSectionClient: React.FC<DraggableSectionClientProps> = ({
  questions,
  isFixed = false,
}) => {
  const { moveQuestion } = useDragDrop();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        moveQuestion(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4 w-full">
          {questions.map((question, index) => (
            <DraggableQuestionClient
              key={question.id}
              question={question}
              index={index}
              isFixed={isFixed}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}; 