"use client";

import {
  ChevronRight,
  CircleCheck,
  CircleHelp,
  MessageSquareText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AiReviewDialog } from "../_components/ai-review-dialog";
import { UserReviewDialog } from "../_components/user-review-dialog";
import { useReviewContext } from "../review-context";

type ReviewType = "ai" | "team";
type FilterStatus = "all" | "unresolved" | "resolved";

type ReviewSidebarProps = {
  userType?: "reviewer" | "reviewee";
};

const ReviewSidebar = ({ userType = "reviewee" }: ReviewSidebarProps) => {
  const { isReviewCollapsed, setIsReviewCollapsed } = useReviewContext();
  const [selectedReviewType, setSelectedReviewType] =
    useState<ReviewType>("ai");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

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

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([
    {
      id: 1,
      questionNo: "#5・スクリーニング調査・Q1",
      type: "AIレビュー・回答テスト結果",
      reviewerName: "佐藤花子",
      time: "1分前",
      comment:
        "スクリーニング設問の1問目で、回答者の性別を尋ねています。設問タイプは単一選択で問題ないと考えられますが、LGBTQの人々の存在を考慮して、選択肢には「男性」「女性」以外に、「その他」や「答えたくない」もあると望ましいです。",
      status: "unresolved",
      reviewType: "ai",
    },
    {
      id: 2,
      questionNo: "#4・本調査・Q8",
      type: "AIレビュー・カバレッジ検証結果",
      reviewerName: "田中太郎",
      time: "10分前",
      comment:
        "前の設問からジャンプ条件が設定されておらず、この設問に辿り着けませんでした。",
      status: "unresolved",
      reviewType: "ai",
    },
    {
      id: 3,
      questionNo: "#3・本調査・Q28",
      type: "AIレビュー・カバレッジ検証結果",
      reviewerName: "鈴木一郎",
      time: "15分前",
      comment:
        "前の設問からジャンプ条件が設定されておらず、この設問に辿り着けませんでした。",
      status: "resolved",
      reviewType: "ai",
    },
    {
      id: 4,
      questionNo: "#2・本調査・Q18",
      type: "AIレビュー・回答テスト結果",
      reviewerName: "山田花子",
      time: "2時間前",
      comment:
        "他の設問では「教えてください」ですが、この設問では「教えてください」になっています。",
      status: "unresolved",
      reviewType: "ai",
      replies: 1,
    },
    {
      id: 5,
      questionNo: "#1・タイトル全体",
      type: "AIレビュー・カバレッジ検証結果",
      reviewerName: "高橋次郎",
      time: "8時間前",
      comment: "セクション",
      status: "unresolved",
      reviewType: "ai",
    },
    {
      id: 6,
      questionNo: "#2・本調査・Q5",
      type: "佐藤花子",
      reviewerName: "佐藤花子",
      time: "30分前",
      comment: "選択肢の順序を見直した方が良いと思います。",
      status: "unresolved",
      reviewType: "team",
    },
    {
      id: 7,
      questionNo: "#3・スクリーニング調査・Q3",
      type: "田中太郎",
      reviewerName: "田中太郎",
      time: "1時間前",
      comment:
        "質問文が長すぎるので、もう少し簡潔にしてください。 質問文が長すぎるので、もう少し簡潔にしてください。",
      status: "resolved",
      reviewType: "team",
    },
  ]);

  const toggleItemStatus = (itemId: number) => {
    setReviewItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: item.status === "resolved" ? "unresolved" : "resolved",
            }
          : item,
      ),
    );
  };

  const handleItemDoubleClick = (item: ReviewItem) => {
    if (item.reviewType === "ai") {
      setIsAiDialogOpen(true);
    } else {
      setIsUserDialogOpen(true);
    }
  };

  // Filter items based on selected review type and status
  const filteredItems = reviewItems.filter((item) => {
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
          isReviewCollapsed ? "h-16" : "h-[calc(100vh-6rem)]",
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
            <div className="flex-1 overflow-y-auto">
              {filteredItems.map((item, _index) => (
                // biome-ignore lint/a11y/noStaticElementInteractions: <>
                <div
                  key={item.id}
                  className={cn(
                    "px-6 py-4 border-b border-[#DCDCDC] hover:bg-[#E7ECF0] cursor-pointer bg-white",
                  )}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9DA0A7] font-medium">
                        {item.questionNo}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemStatus(item.id);
                      }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {item.status === "resolved" ? (
                        <CircleCheck className="w-4 h-4 text-white fill-[#138FB5]" />
                      ) : (
                        <CircleCheck className="w-4 h-4 text-[#979BA2]" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-[#333333] font-medium">
                      {selectedReviewType === "ai"
                        ? item.type
                        : item.reviewerName}
                    </span>
                    <span className="text-xs text-[#9DA0A7]">{item.time}</span>
                  </div>
                  <p className="text-sm text-[#333333]">{item.comment}</p>
                  {item.replies && (
                    <p className="text-xs text-[#9DA0A7] mt-2">
                      {item.replies}件の返信
                    </p>
                  )}
                </div>
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
      />
      <UserReviewDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        userType={userType}
      />
    </div>
  );
};

export default ReviewSidebar;
