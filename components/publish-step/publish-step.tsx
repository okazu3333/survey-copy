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

  // 文字数に応じて動的に幅を計算
  const getStepWidth = (step: string) => {
    const charCount = step.length;
    // 特定の文字列に対してより正確な幅設定
    if (step === "概要の設定") return "w-28 sm:w-32 lg:w-36"; // 6文字だが幅が必要
    if (step === "設問の設定") return "w-28 sm:w-32 lg:w-36"; // 6文字だが幅が必要
    if (step === "調査票の確定") return "w-32 sm:w-36 lg:w-40"; // 7文字で最も長い
    
    // 一般的な文字数ベースの設定
    if (charCount <= 4) return "w-16 sm:w-20 lg:w-24"; // 短いテキスト
    if (charCount <= 5) return "w-20 sm:w-24 lg:w-28"; // 中程度のテキスト
    if (charCount <= 6) return "w-24 sm:w-28 lg:w-32"; // 6文字（その他）
    if (charCount <= 8) return "w-28 sm:w-32 lg:w-36"; // 長いテキスト
    return "w-32 sm:w-36 lg:w-40"; // 非常に長いテキスト
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
                <div
                  className={cn(
                    "flex items-center justify-center gap-1 rounded px-3 py-1 text-xs sm:gap-2 sm:px-4 h-6 sm:h-7 min-w-0",
                    getStepWidth(step),
                    "transition-all duration-200 hover:scale-105",
                    {
                      "bg-[#138FB5] font-bold text-white shadow-md": status === "current",
                      "bg-white font-medium text-[#138FB5] hover:bg-gray-50":
                        status === "next" || status === "complete",
                    },
                  )}
                  onClick={() => onStepClick?.(index)}
                  style={{ cursor: onStepClick ? "pointer" : "default" }}
                >
                  <span className="truncate text-[10px] sm:text-xs leading-tight px-1">{step}</span>
                  {status === "complete" && (
                    <CircleCheck className="h-3 w-3 flex-shrink-0 text-[#4BBC80] sm:h-4 sm:w-4" />
                  )}
                </div>
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
