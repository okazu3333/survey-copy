"use client";

import { ModeToggle } from "../_components/mode-toggle";
import { LogicCheckSection } from "./_components/logic-check-section";

const Page = () => {
  return (
    <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
      {/* Header Section with Mode Toggle */}
      <ModeToggle currentMode="logic" />

      {/* User Information Section */}
      <LogicCheckSection />
    </div>
  );
};

export default Page;
