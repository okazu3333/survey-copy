"use client";

import { SurveyCardHeader } from "@/components/survey-card-header";
import { ModeToggle } from "../_components/mode-toggle";
import { SurveyPreviewSection } from "./_components/survey-preview-section";

const Page = () => {

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="w-full py-6 px-4">
        <div className="flex justify-center max-w-[1440px] mx-auto">
          {/* メインコンテンツ */}
          <div className="flex flex-col gap-0 w-full max-w-[1000px]">
            <SurveyCardHeader
              title="設問の設定"
              workingTitle=""
              currentStep={2}
              enableDefaultNavigation={true}
            />
            <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
              {/* Header Section with Mode Toggle */}
              <ModeToggle currentMode="preview" />

              <SurveyPreviewSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
