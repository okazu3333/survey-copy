"use client";

import { ModeToggle } from "../_components/mode-toggle";
import { SurveyEditSection } from "./_components/survey-edit-section";

const Page = () => {
  return (
    <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
      {/* Header Section with Mode Toggle */}
      <ModeToggle currentMode="edit" />

      {/* Survey Edit Area */}
      <SurveyEditSection />
    </div>
  );
};

export default Page;
