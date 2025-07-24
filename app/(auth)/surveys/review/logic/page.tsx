"use client";

import { Suspense, useState } from "react";
import { SurveyCardHeader } from "@/components/survey-card-header";
import type { ReviewItem } from "@/lib/types/review";
import { LogicReviewDialog } from "../_components/logic-review-dialog";
import { ReviewModeToggle } from "../_components/review-mode-toggle";
import { useReviewContext } from "../review-context";
import { PreviewLogicCheckSection } from "./_components/preview-logic-check-section";

const Page = () => {
  const { reviewItems, addReviewItem, updateReviewItem } = useReviewContext();
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  // ロジックチェック専用のコメントをフィルタリング
  const logicCheckItems = reviewItems.filter(
    (item) => item.type === "ロジック" || item.sectionId === "logic",
  );

  const handleAddComment = (comment: ReviewItem) => {
    addReviewItem(comment);
  };

  const handleUpdateComment = (
    id: number,
    updatedComment: Partial<ReviewItem>,
  ) => {
    updateReviewItem(id, updatedComment);
  };

  return (
    <div className="flex flex-col gap-0">
      <SurveyCardHeader
        workingTitle=""
        currentStep={3}
        enableDefaultNavigation={true}
      />
      <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
        {/* Header Section with Mode Toggle */}
        <ReviewModeToggle currentMode="logic" />

        {/* Logic Review Buttons 削除済み */}
        {/* <div className="flex gap-4 w-full max-w-4xl">
          <button
            type="button"
            onClick={() => setIsAiDialogOpen(true)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            AIロジックレビュー
          </button>
          <button
            type="button"
            onClick={() => setIsUserDialogOpen(true)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ロジックレビュー
          </button>
        </div> */}

        {/* Logic Check Section with Comments */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-[#138FB5] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">
                  ロジックチェックを読み込み中...
                </p>
              </div>
            </div>
          }
        >
          <PreviewLogicCheckSection
            reviewItems={logicCheckItems}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
          />
        </Suspense>

        {/* Logic Review Dialogs */}
        <LogicReviewDialog
          isOpen={isAiDialogOpen}
          onClose={() => setIsAiDialogOpen(false)}
          onAddComment={handleAddComment}
          reviewType="ai"
        />
        <LogicReviewDialog
          isOpen={isUserDialogOpen}
          onClose={() => setIsUserDialogOpen(false)}
          onAddComment={handleAddComment}
          reviewType="team"
        />
      </div>
    </div>
  );
};

export default Page;
