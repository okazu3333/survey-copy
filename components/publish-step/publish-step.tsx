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

  // 全てのステップを同じ幅に統一
  const getStepWidth = () => {
    return "w-24 sm:w-28 lg:w-32";
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
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center gap-0 overflow-x-auto sm:gap-0">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step} className="flex items-center flex-shrink-0">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center gap-1 rounded px-2 py-1 text-xs sm:gap-2 sm:px-3 h-6 sm:h-7 min-w-0",
                      getStepWidth(),
                      "transition-all duration-200 hover:scale-105",
                      {
                        "bg-[#138FB5] font-bold text-white shadow-md":
                          status === "current",
                        "bg-white font-medium text-[#138FB5] hover:bg-gray-50":
                          status === "next" || status === "complete",
                      },
                    )}
                    onClick={() => onStepClick?.(index)}
                    disabled={!onStepClick}
                  >
                    <span className="truncate text-[9px] sm:text-[10px] lg:text-xs leading-tight px-0.5">
                      {step}
                    </span>
                    {status === "complete" && (
                      <CircleCheck className="h-3 w-3 flex-shrink-0 text-[#4BBC80] sm:h-4 sm:w-4" />
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div className="h-0.5 w-2 bg-white sm:w-3" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
