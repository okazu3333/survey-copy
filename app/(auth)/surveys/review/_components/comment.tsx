"use client";

import { CircleCheck, Edit, MoreHorizontal, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { CommentProps } from "@/lib/types/review";
import { cn } from "@/lib/utils";
import { useReviewContext } from "../review-context";
import { AiReviewDialog } from "./ai-review-dialog";
import { UserReviewDialog } from "./user-review-dialog";

export const Comment = ({
  id: _id,
  questionNo: _questionNo,
  type: _type,
  reviewerName,
  time,
  comment,
  status,
  reviewType,
  replies: _replies,
  className,
  userType = "reviewee",
  onDelete,
}: CommentProps) => {
  const { setIsAnyCommentOpen } = useReviewContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ダイアログが開いているかどうかを判定
  const isAnyDialogOpen = isDialogOpen || isDeleteDialogOpen || isExpanded;

  // ダイアログの状態が変更された時にコンテキストを更新
  useEffect(() => {
    setIsAnyCommentOpen(isAnyDialogOpen);
  }, [isAnyDialogOpen, setIsAnyCommentOpen]);

  const handleToggle = () => {
    // 削除ダイアログが開いている時は他のダイアログを開かない
    if (isDeleteDialogOpen) return;

    // AIコメントの場合は直接ダイアログを開く
    if (reviewType === "ai") {
      setIsDialogOpen(true);
    } else {
      // 通常のコメントの場合は展開/折りたたみ
      setIsExpanded(!isExpanded);
    }
  };

  const toggleStatus = () => {
    // Handle resolve action
    console.log("Resolved comment:", _id);
  };

  const handleEditQuestion = () => {
    // 削除ダイアログが開いている時は他のダイアログを開かない
    if (isDeleteDialogOpen) return;
    setIsDialogOpen(true);
  };

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleSaveComment = () => {
    // Here you would typically save the comment to your backend
    console.log("Save comment:", _id, editedComment);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedComment(comment);
    setIsEditing(false);
  };

  const handleDeleteComment = () => {
    // 削除ダイアログを開く前に、他のダイアログの状態をリセット
    setIsDialogOpen(false);
    setIsExpanded(false);
    setIsEditing(false);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Here you would typically delete the comment from your backend
    console.log("Delete comment:", _id);
    setIsDeleteDialogOpen(false);
    setIsExpanded(false);

    // Call the parent's delete callback to remove the comment from the UI
    if (onDelete) {
      onDelete(_id);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className={cn("transition-all duration-200", className)}>
      {/* Header - Always visible */}
      {!isExpanded && (
        <Button
          variant="ghost"
          className={cn(
            "justify-between cursor-pointer w-11 h-11 p-0 [&_svg]:size-full",
            // ダイアログが開いている時はz-indexを下げて競合を回避
            isAnyDialogOpen ? "z-0" : "z-30",
          )}
          onClick={handleToggle}
        >
          {reviewType === "ai" ? (
            <svg
              className="w-full h-full"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="AI assistant icon"
            >
              <g filter="url(#filter0_d_2595_1400)">
                <path
                  d="M6 20C6 12.268 12.268 6 20 6C27.732 6 34 12.268 34 20C34 27.732 27.732 34 20 34H7C6.44771 34 6 33.5523 6 33V20Z"
                  fill="#60ADC2"
                />
              </g>
              <path
                d="M13 26L16.416 15.682H18.292L21.708 26H19.986L18.32 20.4C18.152 19.84 17.9887 19.2753 17.83 18.706C17.6713 18.1273 17.5127 17.5487 17.354 16.97H17.298C17.1487 17.558 16.99 18.1367 16.822 18.706C16.6633 19.2753 16.5 19.84 16.332 20.4L14.666 26H13ZM14.932 23.074V21.786H19.748V23.074H14.932ZM23.067 26V15.682H24.691V26H23.067Z"
                fill="white"
              />
              <defs>
                <filter
                  id="filter0_d_2595_1400"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2595_1400"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2595_1400"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          ) : (
            <svg
              className="w-full h-full"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Team member icon"
            >
              <g filter="url(#filter0_d_team_icon)">
                <path
                  d="M6 20C6 12.268 12.268 6 20 6C27.732 6 34 12.268 34 20C34 27.732 27.732 34 20 34H7C6.44771 34 6 33.5523 6 33V20Z"
                  fill="#60ADC2"
                />
              </g>
              <g transform="translate(4, 4)">
                <path
                  d="M16 4.66699C17.4883 4.66699 18.9619 4.95979 20.3369 5.5293C21.7119 6.09885 22.9613 6.93393 24.0137 7.98633C25.0661 9.03873 25.9012 10.2881 26.4707 11.6631C27.0402 13.0381 27.333 14.5117 27.333 16C27.333 19.0058 26.1391 21.8883 24.0137 24.0137C21.8883 26.1391 19.0058 27.333 16 27.333C12.9942 27.333 10.1117 26.1391 7.98633 24.0137C5.86092 21.8883 4.66699 19.0058 4.66699 16C4.66699 14.5117 4.95979 13.0381 5.5293 11.6631C6.09885 10.2881 6.93393 9.03873 7.98633 7.98633C9.03873 6.93393 10.2881 6.09885 11.6631 5.5293C13.0381 4.95979 14.5117 4.66699 16 4.66699Z"
                  fill="#75BACF"
                  stroke="white"
                  strokeWidth="1.33333"
                />
                <path
                  d="M15.9993 18.6667C18.9449 18.6667 21.3327 16.2789 21.3327 13.3333C21.3327 10.3878 18.9449 8 15.9993 8C13.0538 8 10.666 10.3878 10.666 13.3333C10.666 16.2789 13.0538 18.6667 15.9993 18.6667Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24.2924 24.328C24.3724 24.4573 24.3471 24.6213 24.2391 24.724C22.0137 26.8315 19.0641 28.0042 15.9991 28C12.9341 28.0042 9.98452 26.8315 7.75909 24.724C7.70659 24.6738 7.67271 24.6073 7.66302 24.5353C7.65333 24.4634 7.6684 24.3903 7.70576 24.328C9.25509 21.7573 12.3871 20 15.9991 20C19.6111 20 22.7418 21.7573 24.2924 24.328Z"
                  fill="white"
                />
                <path
                  d="M16 4.66699C17.4883 4.66699 18.9619 4.95979 20.3369 5.5293C21.7119 6.09885 22.9613 6.93393 24.0137 7.98633C25.0661 9.03873 25.9012 10.2881 26.4707 11.6631C27.0402 13.0381 27.333 14.5117 27.333 16C27.333 19.0058 26.1391 21.8883 24.0137 24.0137C21.8883 26.1391 19.0058 27.333 16 27.333C12.9942 27.333 10.1117 26.1391 7.98633 24.0137C5.86092 21.8883 4.66699 19.0058 4.66699 16C4.66699 14.5117 4.95979 13.0381 5.5293 11.6631C6.09885 10.2881 6.93393 9.03873 7.98633 7.98633C9.03873 6.93393 10.2881 6.09885 11.6631 5.5293C13.0381 4.95979 14.5117 4.66699 16 4.66699Z"
                  stroke="white"
                  strokeWidth="1.33333"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_team_icon"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_team_icon"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_team_icon"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          )}
        </Button>
      )}

      {/* Expanded content - 最前面に表示 */}
      {isExpanded && !isDialogOpen && (
        <div
          className="bg-white rounded-3xl border border-[#DCDCDC] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.16)] max-w-[400px] max-h-[500px] overflow-hidden transform -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-[9999999]"
          style={{
            zIndex: 9999999,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "400px",
            maxHeight: "500px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <span className="text-sm font-medium text-[#333333]">
              レビューコメント
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus();
                }}
                className="hover:opacity-80 transition-opacity"
              >
                {status === "resolved" ? (
                  <CircleCheck className="w-4 h-4 text-white fill-[#138FB5]" />
                ) : (
                  <CircleCheck className="w-4 h-4 text-[#979BA2]" />
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleToggle}
              >
                <X className="h-4 w-4 text-[#606060]" />
              </Button>
            </div>
          </div>

          <Separator className="bg-[#DCDCDC]" />

          {/* Content */}
          <div className="flex flex-col gap-4 px-6 py-4 max-h-[400px] overflow-y-auto">
            {/* Comment header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#9DA0A7]">
                  {reviewerName}
                </span>
                <span className="text-xs font-medium text-[#9DA0A7]">
                  {time}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-4 w-4 text-[#979BA2]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-32 z-[9999999]"
                  sideOffset={5}
                >
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
            </div>

            {/* Comment body */}
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <Textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="min-h-[150px] w-full min-w-[300px] text-sm border-[#DCDCDC] focus:border-[#138FB5] resize-none"
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
              <>
                <p className="text-sm text-[#333333] whitespace-pre-wrap break-words">
                  {comment}
                </p>

                {/* Edit question button */}
                <Button
                  variant="outline"
                  className="w-full rounded-[20px] border-[#DCDCDC] text-sm font-bold text-[#333333] hover:bg-gray-50"
                  onClick={handleEditQuestion}
                >
                  {userType === "reviewer"
                    ? "レビュースレッドを確認する"
                    : "設問を編集する"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Dialog based on reviewType - 最前面に表示 */}
      {!isDeleteDialogOpen &&
        (reviewType === "ai" ? (
          <AiReviewDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            userType={userType}
          />
        ) : (
          <UserReviewDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            userType={userType}
          />
        ))}

      {/* Delete confirmation dialog - 最前面に表示 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogPortal>
          {/* カスタムオーバーレイ - 最高のz-index */}
          <div className="fixed inset-0 z-[9999999] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogContent
            className="max-w-[400px] z-[9999999]"
            style={{ zIndex: 9999999 }}
          >
            <DialogHeader>
              <DialogTitle>コメントを削除</DialogTitle>
              <DialogDescription>
                このコメントを削除しますか？この操作は取り消すことができません。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={cancelDelete}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                削除
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};
