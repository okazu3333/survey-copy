"use client";

import {
  ChevronDown,
  CircleCheck,
  Edit,
  HelpCircle,
  Plus,
  SendIcon,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

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

type UserReviewDialogProps = {
  userType?: "reviewer" | "reviewee";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddComment?: (comment: ReviewItem) => void;
  onUpdateComment?: (id: number, updatedComment: Partial<ReviewItem>) => void;
  onDeleteComment?: (id: number) => void;
};

export const UserReviewDialog = ({
  userType = "reviewee",
  open,
  onOpenChange,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: UserReviewDialogProps) => {
  const [commentText, setCommentText] = useState("");
  const [status, setStatus] = useState<"resolved" | "unresolved">("unresolved");
  const [questionChecked, setQuestionChecked] = useState(false);
  const [comments, setComments] = useState([
    {
      author: "佐藤花子",
      time: "15分前",
      content:
        "スクリーニング設問の1問目で、回答者の性別を尋ねています。設問タイプは単一選択で問題ないと考えられますが、LGBTQの人々の存在を考慮して、選択肢には「男性」「女性」以外に、「その他」や「答えたくない」もあると望ましいです。",
    },
    {
      author: "林次郎",
      time: "10分前",
      content: "確かにそういった考慮は必要ですね。山田さん編集をお願いします。",
    },
    {
      author: "山田太郎",
      time: "5分前",
      content: "承知しました！",
    },
  ]);

  // Question options data
  const genderOptions = [
    { id: 1, label: "男性" },
    { id: 2, label: "女性" },
    { id: 3, label: "その他" },
    { id: 4, label: "答えたくない", editable: true },
  ];

  // Settings data
  const settingsData = [
    { label: "必須回答", value: "必須オン", icon: true, hasSwitch: true },
    { label: "回答者条件", value: "全員", icon: true },
    { label: "回答制御", value: "なし", icon: true },
    { label: "対象者条件", value: "なし", icon: true },
    { label: "スキップ条件", value: "なし", icon: true },
    { label: "カテゴリ表示順", value: "通常", icon: true },
    { label: "ジャンプ条件", value: "なし", icon: true },
  ];

  // Handle comment submission
  const handleSendComment = () => {
    if (commentText.trim()) {
      // Add to local comments
      const newComment = {
        author: "現在のユーザー", // In real app, this would be the current user's name
        time: "今",
        content: commentText,
      };
      setComments([...comments, newComment]);

      // Add to review panel if callback provided
      if (onAddComment) {
        const newReviewItem: ReviewItem = {
          id: Date.now(), // Generate unique ID
          questionNo: "#1・スクリーニング調査・Q1", // Default question number
          type: "チームレビュー",
          reviewerName: "現在のユーザー",
          time: "今",
          comment: commentText,
          status: "unresolved",
          reviewType: "team",
        };
        onAddComment(newReviewItem);
      }

      setCommentText("");
      onOpenChange(false); // Close dialog
    }
  };

  const handleEditComment = (commentIndex: number) => {
    // Handle edit comment action
    console.log("Edit comment:", commentIndex);
  };

  const handleDeleteComment = (commentIndex: number) => {
    // Handle delete comment action
    console.log("Delete comment:", commentIndex);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1600px] max-h-[90vh] h-[960px] p-0 gap-0 bg-white rounded-[48px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] overflow-hidden flex">
        <DialogTitle className="sr-only">レビュー・編集画面</DialogTitle>
        <div className="flex flex-col items-start gap-2.5 pt-16 pb-10 px-16 h-full w-full">
          <div className="flex items-start gap-8 relative w-full h-full overflow-hidden">
            {/* Left Panel - Question Editor */}
            <div className="flex flex-col items-center gap-4 flex-1 w-full h-full overflow-hidden">
              <div className="flex flex-col items-start w-full flex-1 overflow-hidden">
                {/* Tab Header */}
                <div className="flex items-center justify-between gap-2 px-6 py-0 w-full">
                  <div className="flex items-center justify-center w-52 h-10 bg-[#138FB5] text-white font-bold text-base rounded-[8px_8px_0px_0px] px-8 py-2">
                    スクリーニング調査
                  </div>

                  <div className="flex h-6 items-center justify-end gap-2.5 flex-1">
                    <div className="font-medium text-xs text-[#333333] whitespace-nowrap">
                      レビューステータス
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setStatus(
                          status === "resolved" ? "unresolved" : "resolved",
                        )
                      }
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {status === "resolved" ? (
                        <CircleCheck className="w-4 h-4 text-white fill-[#138FB5]" />
                      ) : (
                        <CircleCheck className="w-4 h-4 text-[#979BA2]" />
                      )}
                    </button>
                    <div className="w-10 font-bold text-xs text-[#333333] text-center">
                      {status === "resolved" ? "完了" : "未完了"}
                    </div>
                  </div>
                </div>

                {/* Question Content Area */}
                <div className="flex flex-col items-start w-full flex-1 overflow-hidden">
                  <Card className="flex flex-col items-start gap-4 p-4 w-full h-full bg-[#138FB5] rounded-lg border-none">
                    <ScrollArea className="w-full h-full rounded-lg shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)]">
                      <div className="flex flex-col items-start gap-4 px-10 py-8 w-full bg-[#F4F7F9] rounded border border-solid border-[#dcdcdc]">
                        <div className="inline-flex items-center gap-2">
                          <div className="font-bold text-xs text-[#333333] whitespace-nowrap">
                            セクション：未既婚
                          </div>
                        </div>

                        <Card className="flex flex-col items-start w-full bg-white rounded-lg border border-solid border-[#dcdcdc]">
                          <div className="flex items-center gap-3 pl-3 pr-0 py-0 w-full bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
                            <Checkbox
                              className="w-4 h-4"
                              checked={questionChecked}
                              onCheckedChange={(checked) =>
                                setQuestionChecked(checked as boolean)
                              }
                            />
                            <div className="inline-flex items-center justify-center px-4 py-2 bg-[#138FB5]">
                              <div className="w-fit mt-[-1.00px] font-medium text-white text-base text-center whitespace-nowrap">
                                Q1
                              </div>
                            </div>
                          </div>

                          <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 w-full">
                            <Select>
                              <SelectTrigger className="flex w-[200px] items-center justify-between pl-4 pr-2 py-1 rounded-[3px] border border-solid border-[#dcdcdc]">
                                <div className="inline-flex items-center gap-[9px]">
                                  <div className="w-10 font-bold text-xs text-[#333333]">
                                    SA
                                  </div>
                                  <div className="font-bold text-xs text-[#333333] whitespace-nowrap">
                                    単一選択方式
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sa">単一選択方式</SelectItem>
                                <SelectItem value="ma">複数選択方式</SelectItem>
                              </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2 w-full">
                              <div className="flex items-center flex-1">
                                <div className="flex-1 font-medium text-base text-[#333333]">
                                  あなたの性別を教えてください。
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-start gap-2 w-full">
                              <RadioGroup className="w-full">
                                {genderOptions.map((option, _index) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center gap-2 w-full"
                                  >
                                    <div className="flex w-10 items-center justify-end">
                                      <RadioGroupItem
                                        value={option.id.toString()}
                                        id={`option-${option.id}`}
                                        className="w-4 h-4"
                                      />
                                      <Label
                                        htmlFor={`option-${option.id}`}
                                        className="flex flex-col w-6 items-center justify-center gap-2.5"
                                      >
                                        <div className="w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                                          {option.id}
                                        </div>
                                      </Label>
                                    </div>

                                    {option.editable ? (
                                      <div className="flex-1 flex items-center gap-2">
                                        <Input
                                          className="h-10 px-4 py-2 bg-white rounded-sm border-2 border-solid border-[#8e99a2] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)]"
                                          defaultValue={option.label}
                                        />
                                        <button
                                          type="button"
                                          className="w-6 h-6"
                                        >
                                          <X className="w-6 h-6 text-[#606060]" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="px-2 py-0 rounded flex items-center flex-1">
                                        <div className="flex items-start gap-2.5 flex-1">
                                          <div className="flex-1 font-normal text-sm text-[#333333]">
                                            {option.label}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </RadioGroup>

                              <div className="flex flex-col items-center relative w-full mt-2">
                                <Separator className="w-full h-px" />
                                <button
                                  type="button"
                                  className="absolute w-4 h-4 top-[-8px] left-1/2 transform -translate-x-1/2 bg-[#979BA2] rounded-full shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)] flex items-center justify-center"
                                >
                                  <Plus className="w-2 h-2 text-white" />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col items-start gap-2 px-6 py-3.5 w-full bg-[#f5f5f5] rounded overflow-hidden">
                              {settingsData.map((setting, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 w-full"
                                >
                                  <div className="flex w-36 items-center gap-1 px-0 py-1">
                                    <div className="inline-flex items-center gap-2">
                                      <div className="font-medium text-sm text-[#333333] whitespace-nowrap">
                                        {setting.label}
                                      </div>
                                      {setting.icon && (
                                        <div className="inline-flex items-center pt-0.5 pb-0 px-0 self-stretch">
                                          <HelpCircle className="w-4 h-4 text-[#606060]" />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {setting.hasSwitch ? (
                                    <div className="inline-flex items-center gap-2 px-0 py-1">
                                      <Switch
                                        defaultChecked
                                        className="data-[state=checked]:bg-[#138FB5]"
                                      />
                                      <div className="font-medium text-xs text-[#333333] text-center whitespace-nowrap">
                                        {setting.value}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="min-h-10 flex items-center gap-1.5 px-4 py-2 flex-1 bg-white rounded-sm border border-solid border-[#dcdcdc]">
                                      <div className="font-normal text-sm text-[#333333] whitespace-nowrap">
                                        {setting.value}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  </Card>

                  <div className="absolute w-1 h-[230px] top-[245px] left-[726px] bg-[#dcdcdc] rounded" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex h-20 items-center justify-center gap-6 w-full">
                <Button
                  variant="outline"
                  className="h-10 bg-white hover:bg-gray-50 rounded-[20px] border border-solid border-[#dcdcdc] min-w-[168px] px-6 py-4"
                  onClick={() => onOpenChange(false)}
                >
                  <span className="font-bold text-base text-[#3a3a3a] whitespace-nowrap">
                    キャンセル
                  </span>
                </Button>

                {userType === "reviewee" && (
                  <Button className="h-10 bg-[#556064] hover:bg-[#444b4f] rounded-[20px] min-w-[168px] px-6 py-4">
                    <span className="font-bold text-base text-white text-center whitespace-nowrap">
                      編集を保存して反映する
                    </span>
                  </Button>
                )}
              </div>
            </div>

            {/* Right Panel - Comments */}
            <Card className="flex flex-col w-[480px] h-full items-start bg-[#F4F7F9] rounded-lg overflow-hidden border-none">
              <CardContent className="flex flex-col items-start gap-2 px-0 py-2 w-full h-full overflow-hidden">
                <ScrollArea className="w-full h-full">
                  {comments.map((comment, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start gap-4 px-6 py-0 relative self-stretch w-full border-b-2 border-white"
                    >
                      <div className="flex-col min-h-10 items-start justify-center gap-0.5 px-0 py-2 self-stretch w-full flex">
                        <div className="flex items-start gap-0.5 relative self-stretch w-full">
                          <div className="flex items-center gap-2 relative flex-1 grow">
                            <div className="font-medium text-sm text-fontgray whitespace-nowrap">
                              {comment.author}
                            </div>
                            <div className="font-medium text-xs text-fontgray whitespace-nowrap">
                              {comment.time}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex h-5 items-center gap-1 hover:bg-gray-100 rounded p-1"
                              >
                                <div className="inline-flex items-center gap-1">
                                  <div className="w-1 h-1 bg-[#979BA2] rounded-sm" />
                                  <div className="w-1 h-1 bg-[#979BA2] rounded-sm" />
                                  <div className="w-1 h-1 bg-[#979BA2] rounded-sm" />
                                </div>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-32 z-[9999]"
                              sideOffset={5}
                            >
                              <DropdownMenuItem
                                onClick={() => handleEditComment(index)}
                                className="flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                編集
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteComment(index)}
                                className="flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                削除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex flex-col items-start justify-center relative self-stretch w-full">
                          <div className="self-stretch font-medium text-sm text-fontdefault">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>

              {/* Comment input */}
              <div className="flex items-start gap-3 px-4 py-4 pl-6 bg-[#138FB5] w-full">
                <div className="flex items-end gap-3 w-full">
                  <div className="flex-1 bg-white rounded-lg shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)]">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendComment();
                        }
                      }}
                      placeholder="コメントを入力..."
                      className="w-full min-h-[40px] px-4 py-2 bg-transparent border-none resize-none font-medium text-base text-[#333333] placeholder:text-[#999999] focus:outline-none"
                    />
                  </div>
                  <div className="pb-3.5">
                    <Button
                      size="icon"
                      className="w-9 h-9 bg-[#484848] hover:bg-[#333333] rounded-full p-0"
                      onClick={handleSendComment}
                    >
                      <SendIcon className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
