"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize, X } from "lucide-react";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  return (
    <div className="flex flex-col items-start relative self-stretch w-full">
      <motion.div
        layoutId="survey-card"
        className="flex flex-col items-start relative self-stretch w-full"
      >
        <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full bg-[#138FB5] rounded-lg">
          {/* Maximize Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-10 transition-colors"
          >
            <Maximize size={16} className="text-[#138FB5]" />
          </button>

          <ScrollArea className="w-full ">
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
          </ScrollArea>
        </Card>

        {/* Logic Comments Section */}
        <div className="w-full max-w-4xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ロジックレビューコメント
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {localReviewItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                ロジックレビューコメントがありません
              </div>
            ) : (
              localReviewItems.map((item) => (
                <LogicComment
                  key={item.id}
                  {...item}
                  onDelete={handleDeleteComment}
                  onUpdate={onUpdateComment}
                />
              ))
            )}
          </div>
        </div>
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
