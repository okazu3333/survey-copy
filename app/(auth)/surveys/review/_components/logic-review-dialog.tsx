"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewItem } from "@/lib/types/review";

type LogicReviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comment: ReviewItem) => void;
  reviewType: "ai" | "team";
  questionId?: string;
  questionNo?: string;
};

export const LogicReviewDialog = ({
  isOpen,
  onClose,
  onAddComment,
  reviewType,
  questionId,
  questionNo,
}: LogicReviewDialogProps) => {
  const [comment, setComment] = useState("");

  const handleSendComment = () => {
    if (!comment.trim()) return;

    const newComment: ReviewItem = {
      id: Date.now(),
      questionNo: questionNo || "ロジック",
      type: "ロジック",
      reviewerName: reviewType === "ai" ? "AIレビュー" : "田中太郎",
      time: "今",
      comment: comment.trim(),
      status: "unresolved",
      reviewType,
      sectionId: "logic",
      questionId: questionId || "logic",
      position: { x: 50, y: 50 },
    };

    onAddComment(newComment);
    setComment("");
    onClose();
  };

  const handleCancel = () => {
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {reviewType === "ai" ? "AIロジックレビュー" : "ロジックレビュー"}
          </DialogTitle>
          <DialogDescription>
            {reviewType === "ai"
              ? "フローロジックの自動チェック結果を記録します。"
              : "フローロジックに関するレビューコメントを記録します。"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="logic-comment" className="text-sm font-medium">
              ロジックレビューコメント
            </label>
            <Textarea
              id="logic-comment"
              placeholder={
                reviewType === "ai"
                  ? "例: 分岐条件が正しく設定されています。"
                  : "例: この分岐ロジックを改善することを推奨します。"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSendComment} disabled={!comment.trim()}>
            送信
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
