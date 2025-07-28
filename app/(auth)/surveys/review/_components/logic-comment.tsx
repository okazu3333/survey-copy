"use client";

import { CircleCheck, Edit, MoreHorizontal, Trash2 } from "lucide-react";
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
import type { ReviewItem } from "@/lib/types/review";
import { cn } from "@/lib/utils";

type LogicCommentProps = {
  id: number;
  questionNo: string;
  type: string;
  reviewerName: string;
  time: string;
  comment: string;
  status: "unresolved" | "resolved";
  reviewType: "ai" | "team";
  className?: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, updatedComment: Partial<ReviewItem>) => void;
};

export const LogicComment = ({
  id,
  questionNo,
  type,
  reviewerName,
  time,
  comment,
  status,
  reviewType,
  className,
  onDelete,
  onUpdate,
}: LogicCommentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleStatus = () => {
    if (onUpdate) {
      onUpdate(id, {
        status: status === "resolved" ? "unresolved" : "resolved",
      });
    }
  };

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleSaveComment = () => {
    if (onUpdate) {
      onUpdate(id, { comment: editedComment });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedComment(comment);
    setIsEditing(false);
  };

  const handleDeleteComment = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setIsDeleteDialogOpen(false);
    setIsExpanded(false);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex flex-col gap-4 px-6 py-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left",
          status === "resolved" && "opacity-75",
          className,
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              {reviewerName}
            </span>
            <span className="text-xs font-medium text-gray-500">{time}</span>
            {reviewType === "ai" && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                AI
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStatus();
              }}
              className={cn(
                "p-1 rounded transition-colors",
                status === "resolved"
                  ? "text-green-600 hover:bg-green-50"
                  : "text-gray-400 hover:bg-gray-50",
              )}
            >
              <CircleCheck size={16} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:bg-gray-50 rounded transition-colors"
                >
                  <MoreHorizontal size={16} className="text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditComment}>
                  <Edit size={14} className="mr-2" />
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteComment}
                  className="text-red-600"
                >
                  <Trash2 size={14} className="mr-2" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">
              {questionNo}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {type}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="min-h-[80px]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveComment();
                  }}
                >
                  保存
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {comment}
            </p>
          )}
        </div>

        {isExpanded && (
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              className="w-full text-sm font-bold text-gray-800 hover:bg-gray-50 rounded-lg py-2 transition-colors"
            >
              ロジックスレッドを確認する
            </button>
          </div>
        )}
      </button>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle>コメントを削除</DialogTitle>
            <DialogDescription>
              このロジックレビューコメントを削除しますか？この操作は元に戻せません。
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
