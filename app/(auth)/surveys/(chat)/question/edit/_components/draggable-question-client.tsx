"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripIcon } from "@/components/ui/grip-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, X } from "lucide-react";
import { DraggableQuestion } from "./drag-drop-context";

interface DraggableQuestionClientProps {
  question: DraggableQuestion;
  index: number;
  isFixed?: boolean;
}

export const DraggableQuestionClient: React.FC<DraggableQuestionClientProps> = ({
  question,
  index,
  isFixed = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc] ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
        {/* ドラッグハンドル */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
        >
          <GripIcon className="w-4 h-4 text-[#556064]" />
        </div>

        <Checkbox className="w-4 h-4" />
        
        <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
          <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
            {question.id}
          </div>
        </div>

        <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
          {isFixed && (
            <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                固定設問
              </div>
              <Lock className="w-4 h-4 text-[#333333]" />
            </div>
          )}
          <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
            {question.typeLabel}
          </div>
        </div>

        <div className="absolute top-[3px] right-[3px] w-6 h-6 cursor-pointer flex items-center justify-center">
          <X className="w-4 h-4 text-[#556064]" />
        </div>
      </div>

      <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center relative flex-1 grow">
            <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
              {question.question}
            </div>
          </div>
        </div>

        {question.options.length > 0 && (
          <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
            {question.options.map((option) => (
              <div
                key={`option-${option.id}`}
                className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
              >
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      {option.id}
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      {option.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 設定セクション */}
        <div className="flex flex-col items-start gap-2 px-6 py-3.5 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded overflow-hidden">
          {question.settings.map((setting, settingIndex) => (
            <div
              key={`setting-${settingIndex}`}
              className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] min-w-0"
            >
              <div className="flex w-36 items-center gap-1 px-0 py-1 relative flex-shrink-0">
                <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] min-w-0">
                  <label className="w-fit font-medium text-[#333333] text-sm relative mt-[-1.00px] truncate">
                    {setting.label}
                  </label>
                </div>
              </div>
              <div className="flex-1 px-2 py-1">
                <div className="text-sm text-[#333333]">
                  {setting.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 