"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { GripIcon } from "@/components/ui/grip-icon";
import type { DraggableQuestion } from "./drag-drop-context";
import { DraggableQuestionComponent } from "./draggable-question";

const DraggableSectionClient = dynamic(
  () =>
    import("./draggable-section-client").then((mod) => ({
      default: mod.DraggableSectionClient,
    })),
  { ssr: false },
);

interface DraggableSectionProps {
  title: string;
  questions: DraggableQuestion[];
  isFixed?: boolean;
}

export const DraggableSection: React.FC<DraggableSectionProps> = ({
  title,
  questions,
  isFixed = false,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
      <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
        <GripIcon className="w-4 h-4 text-[#556064]" />
        <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
          {title}
        </div>
      </div>

      {isClient ? (
        <DraggableSectionClient questions={questions} isFixed={isFixed} />
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {questions.map((question, index) => (
            <DraggableQuestionComponent
              key={question.id}
              question={question}
              _index={index}
              isFixed={isFixed}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
