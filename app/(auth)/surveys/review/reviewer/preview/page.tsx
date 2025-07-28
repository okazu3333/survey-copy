"use client";

import { ReviewModeToggle } from "../../_components/review-mode-toggle";
import { ReviewPreviewSection } from "../../_components/review-preview-section";

const Page = () => {
  // デバッグ用ログ
  console.log("Reviewer Preview Page - userType: reviewer");

  return (
    <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-lg shadow-main-bg">
      <ReviewModeToggle currentMode="preview" type="reviewer" />

      <ReviewPreviewSection userType="reviewer" />
    </div>
  );
};

export default Page;
