"use client";

import { SurveyCardHeader } from "@/components/survey-card-header";
import { SurveyEditSection } from "../../(chat)/question/edit/_components/survey-edit-section";
import { ReviewModeToggle } from "../_components/review-mode-toggle";

export default function ReviewEditPage() {
  return (
    <div className="flex flex-col gap-0">
      <SurveyCardHeader
        workingTitle=""
        currentStep={3}
        enableDefaultNavigation={true}
      />
      <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
        {/* Header Section with Mode Toggle */}
        <ReviewModeToggle currentMode="edit" />
        <div className="w-full flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold text-[#138FB5] mb-4">編集モード</h2>
          <SurveyEditSection />
        </div>
      </div>
    </div>
  );
}
