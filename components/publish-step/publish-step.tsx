"use client";

import { Check } from "lucide-react";
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

  const handleStepClick = (stepIndex: number) => {
    // 現在のステップより前のステップのみクリック可能
    if (stepIndex <= currentStep && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 bg-[#75BACF] px-6 py-2.5",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white">配信までのステップ</h3>
        <div className="flex items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div key={step} className="flex items-center">
                <StepItem 
                  label={step} 
                  status={status} 
                  onClick={() => handleStepClick(index)}
                  isClickable={index <= currentStep}
                />
                {index < steps.length - 1 && (
                  <div className="h-0.5 w-4 bg-white" />
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
  onClick?: () => void;
  isClickable?: boolean;
};

const StepItem = ({ label, status, onClick, isClickable }: StepItemProps) => {
  return (
    <div
      className={cn(
        "flex h-6 w-32 items-center justify-center gap-2 rounded px-4 py-1 text-xs",
        {
          "bg-[#138FB5] font-bold text-white": status === "current",
          "bg-white font-medium text-[#138FB5]":
            status === "next" || status === "complete",
          "cursor-pointer hover:opacity-80 transition-opacity": isClickable,
          "cursor-default": !isClickable,
        },
      )}
      onClick={onClick}
    >
      <span className="truncate">{label}</span>
      {status === "complete" && <Check className="h-4 w-4 text-[#4BBC80]" />}
    </div>
  );
};
