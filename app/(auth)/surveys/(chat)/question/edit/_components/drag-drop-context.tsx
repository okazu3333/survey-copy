"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DraggableQuestion {
  id: string;
  type: string;
  typeLabel: string;
  question: string;
  options: Array<{ id: number; label: string }>;
  settings: Array<{ label: string; value: string; isToggled?: boolean }>;
}

interface DragDropContextType {
  questions: DraggableQuestion[];
  moveQuestion: (oldIndex: number, newIndex: number) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
  initialQuestions: DraggableQuestion[];
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  initialQuestions,
}) => {
  const [questions, setQuestions] = useState<DraggableQuestion[]>(initialQuestions);

  const moveQuestion = (oldIndex: number, newIndex: number) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const [movedQuestion] = newQuestions.splice(oldIndex, 1);
      newQuestions.splice(newIndex, 0, movedQuestion);
      return newQuestions;
    });
  };

  return (
    <DragDropContext.Provider value={{ questions, moveQuestion }}>
      {children}
    </DragDropContext.Provider>
  );
}; 