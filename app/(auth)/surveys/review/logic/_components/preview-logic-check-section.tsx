"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GitBranch, List, Maximize, Minus, Plus, X } from "lucide-react";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import type { ReviewItem } from "@/lib/types/review";
import { LogicComment } from "../../_components/logic-comment";
import { LogicCheckSurveyContent } from "./logic-check-survey-content";

type QuestionFormData = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string[];
};

type PreviewLogicCheckSectionProps = {
  reviewItems?: ReviewItem[];
  onDeleteComment?: (id: number) => void;
  onAddComment?: (comment: ReviewItem) => void;
  onUpdateComment?: (id: number, updatedComment: Partial<ReviewItem>) => void;
};

export const PreviewLogicCheckSection = ({
  reviewItems = [],
  onDeleteComment,
  onAddComment,
  onUpdateComment,
}: PreviewLogicCheckSectionProps) => {
  const [localReviewItems, setLocalReviewItems] =
    useState<ReviewItem[]>(reviewItems);

  const handleDeleteComment = (id: number) => {
    setLocalReviewItems((prev) => prev.filter((item) => item.id !== id));
  };
  const { handleSubmit } = useForm<QuestionFormData>({
    defaultValues: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: [],
    },
  });

  const onSubmit = (data: QuestionFormData) => {
    console.log("Form submitted:", data);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<"sheet" | "tree">("tree");
  const [zoom, setZoom] = useState(1);

  // 仮のズーム関数
  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  return (
    <div
      className={`flex flex-col items-start relative self-stretch w-full${isExpanded ? " fixed inset-0 z-[9999] bg-white" : ""}`}
    >
      <motion.div
        layoutId="survey-card"
        className="flex flex-col items-start relative self-stretch w-full"
      >
        <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full bg-[#138FB5] rounded-lg">
          {/* 右上: 全画面ボタン */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-10 transition-colors"
          >
            {isExpanded ? (
              <X size={16} className="text-[#138FB5]" />
            ) : (
              <Maximize size={16} className="text-[#138FB5]" />
            )}
          </button>
          {/* 右上: シート/ツリーモードトグル（Switch, アイコン） */}
          <div className="absolute top-16 right-4 flex items-center gap-2 z-10 bg-white rounded px-2 py-1 shadow">
            <GitBranch
              size={20}
              className={
                mode === "tree" ? "text-[#138FB5]" : "text-[#888] opacity-60"
              }
            />
            <Switch
              checked={mode === "sheet"}
              onCheckedChange={(checked) => setMode(checked ? "sheet" : "tree")}
              className="data-[state=checked]:bg-[#138FB5]"
            />
            <List
              size={20}
              className={
                mode === "sheet" ? "text-[#138FB5]" : "text-[#888] opacity-60"
              }
            />
          </div>

          <ScrollArea className="w-full ">
            {mode === "tree" ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-start gap-4 relative"
              >
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center w-full h-32">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#138FB5] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-600">読み込み中...</p>
                      </div>
                    </div>
                  }
                >
                  <LogicCheckSurveyContent
                    reviewItems={localReviewItems}
                    onDeleteComment={handleDeleteComment}
                    onAddComment={onAddComment}
                    onUpdateComment={onUpdateComment}
                  />
                </Suspense>
              </form>
            ) : (
              <div className="w-full h-[700px] flex items-center justify-center text-gray-600 bg-white rounded-lg border border-dashed border-gray-300">
                <span className="text-lg font-bold">
                  シートモード（一覧表示）は今後実装予定
                </span>
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Logic Comments Section 削除済み */}
        {/*
        <div className="w-full max-w-4xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ロジックレビューコメント
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            ...
          </div>
        </div>
        */}
      </motion.div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              layoutId="survey-card"
              className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-full overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Expanded Content */}
              <div className="overflow-auto max-h-[calc(100vh-200px)]">
                <div className="p-6">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center w-full h-32">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-[#138FB5] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-xs text-gray-600">読み込み中...</p>
                        </div>
                      </div>
                    }
                  >
                    <LogicCheckSurveyContent reviewItems={reviewItems} />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
