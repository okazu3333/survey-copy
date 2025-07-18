"use client";

import { SurveyCardHeader } from "@/components/survey-card-header";
import { ReviewModeToggle } from "../../_components/review-mode-toggle";
import { ReviewPreviewSection } from "../../_components/review-preview-section";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <SurveyCardHeader
        workingTitle=""
        currentStep={3}
        enableDefaultNavigation={true}
      />
      <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
        <ReviewModeToggle currentMode="preview" type="reviewer" />

        <ReviewPreviewSection userType="reviewer" />
      </div>
    </div>
  );
};

export default Page;
