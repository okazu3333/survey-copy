"use client";

import { ChevronRight, CircleHelp, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AiReviewDialog } from "../_components/ai-review-dialog";
import { ReviewItemComponent } from "../_components/review-item";
import { UserReviewDialog } from "../_components/user-review-dialog";
import { useReviewContext } from "../review-context";

type ReviewType = "ai" | "team";
type FilterStatus = "all" | "unresolved" | "resolved";

type ReviewItem = {
  id: number;
  questionNo: string;
  type: string;
  reviewerName: string;
  time: string;
  comment: string;
  status: "unresolved" | "resolved";
  reviewType: "ai" | "team";
  replies?: number;
};

type ReviewSidebarProps = {
  userType?: "reviewer" | "reviewee";
  onDeleteComment?: (id: number) => void;
  onAddComment?: (comment: ReviewItem) => void;
  onUpdateComment?: (id: number, updatedComment: Partial<ReviewItem>) => void;
};

const ReviewSidebar = ({
  userType = "reviewee",
  onDeleteComment,
  onAddComment,
  onUpdateComment,
}: ReviewSidebarProps) => {
  const {
    isReviewCollapsed,
    setIsReviewCollapsed,
    reviewItems,
    addReviewItem,
    updateReviewItem,
    deleteReviewItem,
  } = useReviewContext();
  const [selectedReviewType, setSelectedReviewType] =
    useState<ReviewType>("ai");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [_isPasswordModalOpen, _setIsPasswordModalOpen] = useState(false);
  const [_pendingDialogType, _setPendingDialogType] = useState<
    "ai" | "user" | null
  >(null);
  const [_isAuthenticated, _setIsAuthenticated] = useState(false);

  const toggleItemStatus = (itemId: number) => {
    updateReviewItem(itemId, {
      status:
        reviewItems.find((item) => item.id === itemId)?.status === "resolved"
          ? "unresolved"
          : "resolved",
    });
  };

  const handleDeleteComment = (itemId: number) => {
    // Remove from context
    deleteReviewItem(itemId);

    // Call parent's delete callback if provided
    if (onDeleteComment) {
      onDeleteComment(itemId);
    }
  };

  const handleAddComment = (newComment: ReviewItem) => {
    // Add to context
    addReviewItem(newComment);

    // Call parent's add callback if provided
    if (onAddComment) {
      onAddComment(newComment);
    }
  };

  const handleUpdateComment = (
    itemId: number,
    updatedComment: Partial<ReviewItem>,
  ) => {
    // Update in context
    updateReviewItem(itemId, updatedComment);

    // Call parent's update callback if provided
    if (onUpdateComment) {
      onUpdateComment(itemId, updatedComment);
    }
  };

  const handleItemDoubleClick = (item: ReviewItem) => {
    if (item.reviewType === "ai") {
      setIsAiDialogOpen(true);
    } else {
      setIsUserDialogOpen(true);
    }
  };

  // Filter items based on selected review type and status
  const filteredItems = reviewItems.filter((item: ReviewItem) => {
    // ロジックチェック専用のコメントは除外（レビューコメントパネルには表示しない）
    if (item.type === "ロジック" || (item as any).sectionId === "logic")
      return false;

    if (item.reviewType !== selectedReviewType) return false;
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  return (
    <div
      className={cn(
        "transition-all duration-300 flex",
        isReviewCollapsed ? "w-16" : "w-[500px]",
      )}
    >
      <div
        className={cn(
          "bg-[#F4F7F9] shadow-[-4px_0px_12px_0px_rgba(0,0,0,0.04)] flex flex-col rounded-lg border-l-2 border-[#DCDCDC]",
          isReviewCollapsed
            ? "h-16"
            : "h-[calc(100vh-6rem)] min-h-[600px] max-h-[800px]",
        )}
      >
        {!isReviewCollapsed && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#138FB5]">
              <div className="flex items-center gap-2">
                <MessageSquareText className="w-6 h-6 text-white" />
                <h2 className="text-white text-base font-bold">
                  レビューコメント
                </h2>
                <button className="ml-2" type="button">
                  <CircleHelp className="w-4 h-4 text-white" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewCollapsed(true)}
                className="text-white hover:opacity-80"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-4 border-b border-[#DCDCDC] flex flex-row justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedReviewType("ai")}
                    className={cn(
                      "px-6 py-1 text-xs font-bold rounded-xl transition-colors",
                      selectedReviewType === "ai"
                        ? "bg-[#138FB5] text-white"
                        : "bg-white text-[#138FB5] border border-[#138FB5]",
                    )}
                  >
                    AIレビュー
                  </button>
                  <div className="w-2 h-[2px] bg-[#138FB5]" />
                  <button
                    type="button"
                    onClick={() => setSelectedReviewType("team")}
                    className={cn(
                      "px-4 py-1 text-xs font-bold rounded-xl transition-colors",
                      selectedReviewType === "team"
                        ? "bg-[#138FB5] text-white"
                        : "bg-white text-[#138FB5] border border-[#138FB5]",
                    )}
                  >
                    チームレビュー
                  </button>
                </div>
              </div>
              <div className="flex items-center rounded-xl border-2 bg-white border-[#138FB5] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFilterStatus("unresolved")}
                  className={cn(
                    "px-3 py-1 text-xs font-bold transition-colors",
                    filterStatus === "unresolved"
                      ? "bg-[#138FB5] text-white"
                      : "text-[#138FB5]",
                  )}
                >
                  未対応
                </button>
                <div className="w-[2px] h-6 bg-[#138FB5]" />
                <button
                  type="button"
                  onClick={() => setFilterStatus("resolved")}
                  className={cn(
                    "px-3 py-1 text-xs font-bold transition-colors",
                    filterStatus === "resolved"
                      ? "bg-[#138FB5] text-white"
                      : "text-[#138FB5]",
                  )}
                >
                  対応済
                </button>
                <div className="w-[2px] h-6 bg-[#138FB5]" />
                <button
                  type="button"
                  onClick={() => setFilterStatus("all")}
                  className={cn(
                    "px-3 py-1 text-xs font-bold transition-colors",
                    filterStatus === "all"
                      ? "bg-[#138FB5] text-white"
                      : "text-[#138FB5]",
                  )}
                >
                  すべて
                </button>
              </div>
            </div>

            {/* Review Items */}
            <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-12rem)]">
              {filteredItems.map((item: ReviewItem, index: number) => (
                <ReviewItemComponent
                  key={index}
                  item={item}
                  selectedReviewType={selectedReviewType}
                  onToggleStatus={toggleItemStatus}
                  onUpdateComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                  onDoubleClick={handleItemDoubleClick}
                  index={index}
                  sectionId={(item as any).sectionId || "main"}
                />
              ))}
            </div>
          </>
        )}

        {isReviewCollapsed && (
          <div className="w-16 h-16 bg-[#138fb5] rounded-[0px_0px_0px_8px] transition-all duration-300 ease-in-out">
            <button
              onClick={() => setIsReviewCollapsed(false)}
              className="flex flex-col items-center justify-center w-full h-16 cursor-pointer"
              type="button"
            >
              <div className="flex flex-col items-center gap-0">
                <MessageSquareText className="w-6 h-6 text-white" />
                <span className="text-white text-xs font-bold">レビュー</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AiReviewDialog
        open={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        userType={userType}
        onAddComment={handleAddComment}
      />
      <UserReviewDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        userType={userType}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default ReviewSidebar;
