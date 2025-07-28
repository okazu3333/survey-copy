"use client";

import { CircleCheck, Edit, Trash2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

type ReviewItemProps = {
  item: ReviewItem;
  selectedReviewType: "ai" | "team";
  onToggleStatus: (itemId: number) => void;
  onUpdateComment?: (id: number, updatedComment: Partial<ReviewItem>) => void;
  onDeleteComment?: (id: number) => void;
  onDoubleClick?: (item: ReviewItem) => void;
};

export const ReviewItemComponent = ({
  item,
  selectedReviewType,
  onToggleStatus,
  onUpdateComment,
  onDeleteComment,
  onDoubleClick,
  index,
  sectionId,
}: ReviewItemProps & { index: number; sectionId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(item.comment);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleSaveComment = () => {
    if (onUpdateComment && editedComment.trim() !== item.comment) {
      onUpdateComment(item.id, { comment: editedComment });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedComment(item.comment);
    setIsEditing(false);
  };

  const handleDeleteComment = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (onDeleteComment) {
      onDeleteComment(item.id);
    }
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  // スレッドタイトル生成
  const sectionType = sectionId === "fixed" ? "スクリーニング調査" : "本調査";
  const threadTitle = `#${index + 1}・${sectionType}・${item.questionNo}`;

  return (
    <>
      <button
        type="button"
        className={cn(
          "px-6 py-4 border-b border-[#DCDCDC] hover:bg-[#E7ECF0] cursor-pointer bg-white min-h-[120px] max-h-[200px] text-left w-full",
        )}
        onDoubleClick={() => {
          // 削除ダイアログが開いている時はダブルクリックを無効化
          if (!showDeleteDialog) {
            onDoubleClick?.(item);
          }
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9DA0A7] font-medium">
              {threadTitle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hover:opacity-80 transition-opacity p-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit className="w-4 h-4 text-[#979BA2]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={handleEditComment}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>編集</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteComment}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>削除</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(item.id);
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
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-[#333333] font-medium">
            {selectedReviewType === "ai" ? item.type : item.reviewerName}
          </span>
          <span className="text-xs text-[#9DA0A7]">{item.time}</span>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="min-h-[80px] text-sm border-[#DCDCDC] focus:border-[#138FB5] resize-none"
              placeholder="コメントを入力..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="text-sm"
              >
                キャンセル
              </Button>
              <Button
                size="sm"
                onClick={handleSaveComment}
                className="text-sm bg-[#138FB5] hover:bg-[#0f7a9a]"
              >
                保存
              </Button>
            </div>
          </div>
        ) : (
          <p
            className="text-sm text-[#333333] overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              maxHeight: "4.5rem",
            }}
          >
            {item.comment}
          </p>
        )}

        {item.replies && (
          <p className="text-xs text-[#9DA0A7] mt-2">{item.replies}件の返信</p>
        )}
      </button>

      {/* 削除確認ダイアログ */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="z-[999999]">
          <DialogHeader>
            <DialogTitle>コメントを削除</DialogTitle>
            <DialogDescription>
              このコメントを削除しますか？この操作は元に戻せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
