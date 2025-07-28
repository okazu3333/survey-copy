"use client";

import {
  ChevronDown,
  CircleCheck,
  Edit,
  Ellipsis,
  HelpCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
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

type AiReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType?: "reviewer" | "reviewee";
  onAddComment?: (comment: ReviewItem) => void;
  onUpdateComment?: (id: number, updatedComment: Partial<ReviewItem>) => void;
  onDeleteComment?: (id: number) => void;
};

type QuestionOption = {
  id: number;
  label: string;
  isEditing?: boolean;
};

type QuestionSetting = {
  label: string;
  hasInfo?: boolean;
  value: string;
  type?: "toggle" | "input" | "textarea";
};

type AiReview = {
  title: string;
  time: string;
  content: string;
};

export const AiReviewDialog = ({
  open,
  onOpenChange,
  userType = "reviewee",
  onAddComment,
}: AiReviewDialogProps) => {
  const [status, setStatus] = useState<"resolved" | "unresolved">("unresolved");
  const [questionChecked, setQuestionChecked] = useState(false);
  const [questionOptions, setQuestionOptions] = useState<QuestionOption[]>([
    { id: 1, label: "男性" },
    { id: 2, label: "女性" },
    { id: 3, label: "その他" },
    { id: 4, label: "答えたくない", isEditing: true },
  ]);
  const [commentText, setCommentText] = useState("");

  const questionSettings: QuestionSetting[] = [
    { label: "必須回答", hasInfo: true, value: "必須オン", type: "toggle" },
    { label: "回答者条件", hasInfo: true, value: "全員" },
    { label: "回答制御", hasInfo: true, value: "なし" },
    { label: "対象者条件", hasInfo: true, value: "なし" },
    { label: "スキップ条件", hasInfo: true, value: "なし" },
    { label: "カテゴリ表示順", hasInfo: true, value: "通常" },
    { label: "ジャンプ条件", hasInfo: true, value: "なし" },
  ];

  const aiReviews: AiReview[] = [
    {
      title: "AIレビュー・回答テスト結果",
      time: "15分前",
      content:
        "スクリーニング設問の1問目で、回答者の性別を尋ねています。設問タイプは単一選択で問題ないと考えられますが、LGBTQの人々の存在を考慮して、選択肢には「男性」「女性」以外に、「その他」や「答えたくない」もあると望ましいです。",
    },
    {
      title: "AIレビュー・回答テスト結果",
      time: "15分前",
      content:
        "スクリーニング設問の1問目で、回答者の性別を尋ねています。設問タイプは単一選択で問題ないと考えられますが、LGBTQの人々の存在を考慮して、選択肢には「男性」「女性」以外に、「その他」や「答えたくない」もあると望ましいです。",
    },
  ];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionOptions];
    newOptions[index] = { ...newOptions[index], label: value };
    setQuestionOptions(newOptions);
  };

  const handleAddOption = () => {
    const newId = Math.max(...questionOptions.map((o) => o.id)) + 1;
    setQuestionOptions([...questionOptions, { id: newId, label: "" }]);
  };

  const handleEditReview = (reviewIndex: number) => {
    // Handle edit review action
    console.log("Edit review:", reviewIndex);
  };

  const handleDeleteReview = (reviewIndex: number) => {
    // Handle delete review action
    console.log("Delete review:", reviewIndex);
  };

  const handleSendComment = () => {
    if (commentText.trim() && onAddComment) {
      const newComment: ReviewItem = {
        id: Date.now(), // Generate unique ID
        questionNo: "#1・スクリーニング調査・Q1", // Default question number
        type: "AIレビュー・回答テスト結果",
        reviewerName: "AIアシスタント",
        time: "今",
        comment: commentText,
        status: "unresolved",
        reviewType: "ai",
      };

      onAddComment(newComment);
      setCommentText(""); // Clear input
      onOpenChange(false); // Close dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent
          className="max-w-[1600px] max-h-[90vh] h-[960px] p-0 gap-0 bg-white rounded-[48px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] overflow-hidden flex z-[9999999]"
          style={{ zIndex: 9999999 }}
        >
          <DialogTitle className="sr-only">AIレビュー・編集画面</DialogTitle>
          <div className="flex flex-col items-start gap-2.5 pt-16 pb-10 px-16 h-full w-full">
            <div className="flex items-start gap-8 relative w-full h-full overflow-hidden">
              {/* Left Panel - Question Editor */}
              <div className="flex flex-col items-center gap-4 flex-1 w-full h-full overflow-hidden">
                <div className="flex flex-col items-start w-full flex-1 overflow-hidden">
                  {/* Tab Header */}
                  <div className="flex items-center gap-2 px-6 py-0 w-full">
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
                                  <SelectItem value="sa">
                                    単一選択方式
                                  </SelectItem>
                                  <SelectItem value="ma">
                                    複数選択方式
                                  </SelectItem>
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
                                  {questionOptions.map((option, index) => (
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

                                      {option.isEditing ? (
                                        <div className="flex-1 flex items-center gap-2">
                                          <Input
                                            className="h-10 px-4 py-2 bg-white rounded-sm border-2 border-solid border-[#8e99a2] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)]"
                                            value={option.label}
                                            onChange={(e) =>
                                              handleOptionChange(
                                                index,
                                                e.target.value,
                                              )
                                            }
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
                                    onClick={handleAddOption}
                                    className="absolute w-4 h-4 top-[-8px] left-1/2 transform -translate-x-1/2 bg-[#979BA2] rounded-full shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)] flex items-center justify-center"
                                  >
                                    <Plus className="w-2 h-2 text-white" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-col items-start gap-2 px-6 py-3.5 w-full bg-[#f5f5f5] rounded overflow-hidden">
                                {questionSettings.map((setting, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 w-full"
                                  >
                                    <div className="flex w-36 items-center gap-1 px-0 py-1">
                                      <div className="inline-flex items-center gap-2">
                                        <div className="font-medium text-sm text-[#333333] whitespace-nowrap">
                                          {setting.label}
                                        </div>
                                        {setting.hasInfo && (
                                          <div className="inline-flex items-center pt-0.5 pb-0 px-0 self-stretch">
                                            <HelpCircle className="w-4 h-4 text-[#606060]" />
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {setting.type === "toggle" ? (
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

              {/* Right Panel - AI Reviews */}
              <div className="flex flex-col w-[480px] h-full bg-[#F4F7F9] rounded-lg overflow-hidden">
                <div className="flex flex-col gap-2 py-2 w-full h-full">
                  <ScrollArea className="w-full h-full flex-1">
                    <div className="flex flex-col">
                      {aiReviews.map((review, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-4 px-6 py-2 w-full border-b-2 border-white"
                        >
                          <div className="flex flex-col gap-0.5 w-full">
                            <div className="flex items-start gap-0.5 w-full">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="font-medium text-sm text-[#9DA0A7] leading-[1.714]">
                                  {review.title}
                                </div>
                                <div className="font-medium text-xs text-[#9DA0A7] leading-[2]">
                                  {review.time}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex items-center h-5"
                                  >
                                    <Ellipsis className="w-5 h-5 text-[#979BA2]" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-32"
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleEditReview(index)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>編集</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteReview(index)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>削除</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="w-full">
                              <div className="font-medium text-sm text-[#333333] leading-[1.714]">
                                {review.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Comment Input Section */}
                  <div className="flex flex-col gap-3 p-4 border-t border-[#DCDCDC] bg-white">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#333333]">
                        コメントを追加
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="コメントを入力してください..."
                        className="min-h-[80px] w-full p-3 text-sm border border-[#DCDCDC] rounded-lg resize-none focus:border-[#138FB5] focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => onOpenChange(false)}
                          className="px-4 py-2 text-sm"
                        >
                          キャンセル
                        </Button>
                        <Button
                          onClick={handleSendComment}
                          disabled={!commentText.trim()}
                          className="px-4 py-2 text-sm bg-[#138FB5] hover:bg-[#0f7a9a] text-white"
                        >
                          送信
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
