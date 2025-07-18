"use client";

import { SurveyCardHeader } from "@/components/survey-card-header";
import { ModeToggle } from "../_components/mode-toggle";
import { SurveyPreviewSection } from "./_components/survey-preview-section";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="w-full py-6 px-4">
        <div className="flex gap-4 max-w-[1440px] mx-auto">
          {/* 左：メインコンテンツ */}
          <div className="flex flex-col gap-0 transition-all duration-300 w-[calc(100%-500px)]">
            <SurveyCardHeader
              title="設問の設定"
              workingTitle="00008　男性化粧品についての調査"
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
