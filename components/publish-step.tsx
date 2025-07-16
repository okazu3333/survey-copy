"use client";

import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "complete" | "current" | "next";

export type Step = {
  id: string;
  label: string;
  status: StepStatus;
};

export type PublishStepProps = {
  currentStep: number;
  steps?: string[];
  className?: string;
  onStepClick?: (stepIndex: number) => void;
};

const defaultSteps = [
  "概要の設定",
  "セクションの設定",
  "設問の設定",
  "レビュー",
  "調査票の確定",
];

export const PublishStep = ({
  currentStep,
  steps = defaultSteps,
  className,
  onStepClick,
}: PublishStepProps) => {
  const getStepStatus = (index: number): StepStatus => {
    if (index < currentStep) return "complete";
    if (index === currentStep) return "current";
    return "next";
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 bg-[#75BACF] px-3 py-2.5 sm:px-6",
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xs font-bold text-white whitespace-nowrap">
          配信までのステップ
        </h3>
        <div className="flex items-center gap-1 overflow-x-auto sm:gap-0">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div key={step} className="flex items-center flex-shrink-0">
                <StepItem
                  label={step}
                  status={status}
                  isCompact={steps.length > 4}
                  onClick={() => onStepClick?.(index)}
                />
                {index < steps.length - 1 && (
                  <div className="h-0.5 w-2 bg-white sm:w-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

type StepItemProps = {
  label: string;
  status: StepStatus;
  isCompact?: boolean;
  onClick?: () => void;
};

const StepItem = ({ label, status, isCompact = false, onClick }: StepItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 rounded px-2 py-1 text-xs sm:gap-2 sm:px-4",
        "h-5 sm:h-6",
        isCompact ? "w-20 sm:w-28 lg:w-32" : "w-24 sm:w-32",
        {
          "bg-[#138FB5] font-bold text-white": status === "current",
          "bg-white font-medium text-[#138FB5]":
            status === "next" || status === "complete",
        },
      )}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <span className="truncate text-[10px] sm:text-xs">{label}</span>
      {status === "complete" && (
        <CircleCheck className="h-3 w-3 flex-shrink-0 text-[#4BBC80] sm:h-4 sm:w-4" />
      )}
    </div>
  );
};
