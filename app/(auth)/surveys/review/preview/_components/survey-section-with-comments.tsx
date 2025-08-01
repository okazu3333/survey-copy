/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { Lock, MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Control, Controller } from "react-hook-form";
import type { Section } from "@/app/(auth)/surveys/_components/survey-section-card";
import { Comment } from "@/app/(auth)/surveys/review/_components/comment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewItem } from "@/lib/types/review";
import { useReviewContext } from "../../review-context";

type SurveySectionWithCommentsProps = {
  section: Section;
  control: Control<any>;
  watch: (name: string) => any;
  setValue: (name: string, value: any) => void;
  getValues: (name?: string) => any;
  reviewItems: ReviewItem[];
  userType?: "reviewer" | "reviewee";
  onAddComment?: (comment: ReviewItem) => void;
  onDeleteComment?: (id: number) => void;
  mode?: "comment" | "cursor";
};

export const SurveySectionWithComments = ({
  section,
  control,
  watch,
  setValue,
  getValues,
  reviewItems,
  userType = "reviewer",
  onAddComment,
  onDeleteComment,
  mode = "comment",
}: SurveySectionWithCommentsProps) => {
  // レビューコンテキストからダイアログの状態を取得
  const { isAnyCommentOpen } = useReviewContext();

  // ローカル状態でコメントを管理
  const [localReviewItems, setLocalReviewItems] =
    useState<ReviewItem[]>(reviewItems);

  // reviewItemsが変更されたらローカル状態を更新
  useEffect(() => {
    setLocalReviewItems(reviewItems);
  }, [reviewItems]);

  // 削除ハンドラー
  const handleDeleteComment = (id: number) => {
    setLocalReviewItems((prev) => prev.filter((item) => item.id !== id));
    onDeleteComment?.(id);
  };
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
    questionId: string;
  } | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: { [optionId: string]: boolean };
  }>({});
  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // コメント入力UIのref
  const commentInputRef = useRef<HTMLDivElement | null>(null);

  // 外側クリックでコメント入力UIを閉じる
  useEffect(() => {
    if (!isAddingComment) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (
        commentInputRef.current &&
        !commentInputRef.current.contains(e.target as Node)
      ) {
        setIsAddingComment(false);
        setNewCommentText("");
        setCursorPosition(null);
      }
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("touchstart", handleClick);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("touchstart", handleClick);
    };
  }, [isAddingComment]);

  const handleMouseMove = (e: React.MouseEvent, questionId: string) => {
    // デバッグ用ログ
    if (userType === "reviewer" && mode === "comment") {
      console.log("Mouse move - userType:", userType, "mode:", mode);
    }

    if (userType !== "reviewer" || isAddingComment || mode !== "comment")
      return;

    const rect = questionRefs.current[questionId]?.getBoundingClientRect();
    if (!rect) return;

    // マウスが実際に質問エリア内にあるかチェック
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setCursorPosition(null);
      return;
    }

    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
    );

    // 既存のコメントとの重なりをチェック
    const questionComments = reviewItems.filter(
      (item) => item.questionId === questionId,
    );
    const isNearExistingComment = questionComments.some((comment) => {
      if (!comment.position) return false;
      const distance = Math.sqrt(
        (x - comment.position.x) ** 2 + (y - comment.position.y) ** 2,
      );
      return distance < 10; // 10%以内の距離は近いと判定
    });

    if (isNearExistingComment) {
      setCursorPosition(null);
      return;
    }

    setCursorPosition({ x, y, questionId });
  };

  const handleMouseLeave = () => {
    if (!isAddingComment) {
      setCursorPosition(null);
    }
  };

  const handleAddComment = () => {
    if (!cursorPosition || !newCommentText.trim()) return;

    // 質問番号を取得
    const question = section.questions.find(
      (q) => q.id === cursorPosition.questionId,
    );
    const questionNo = question ? question.number : "";

    const newComment: ReviewItem = {
      id: Date.now(),
      questionNo: questionNo,
      type: "チームレビュー",
      reviewerName: "あなた",
      time: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      comment: newCommentText,
      status: "unresolved",
      reviewType: "team",
      sectionId: section.id,
      questionId: cursorPosition.questionId,
      position: {
        x: cursorPosition.x,
        y: cursorPosition.y,
      },
    };

    onAddComment?.(newComment);
    setNewCommentText("");
    setIsAddingComment(false);
    setCursorPosition(null);
  };

  const handleCheckboxChange = (
    questionId: string,
    optionId: string,
    checked: boolean,
  ) => {
    const currentValues = (getValues(questionId) as string[]) || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, optionId];
    } else {
      newValues = currentValues.filter((id) => id !== optionId);
    }

    setValue(questionId, newValues);

    // レビュワー画面用のチェックボックス状態管理
    setCheckboxStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [optionId]: checked,
      },
    }));
  };

  // Filter review items for this section
  const sectionComments = localReviewItems.filter(
    (item) => item.sectionId === section.id,
  );

  // Get comments for specific questions (comments are only displayed for questions)
  const getQuestionComments = (questionId: string) => {
    return sectionComments.filter((item) => item.questionId === questionId);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Card
        key={section.id}
        className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)]"
      >
        <div className="inline-flex items-start gap-2 relative">
          <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs leading-6 whitespace-nowrap">
            {section.title}
          </div>
        </div>

        {section.questions.map((question) => {
          const questionComments = getQuestionComments(question.id);

          return (
            // biome-ignore lint/a11y/useSemanticElements: <>
            <div
              key={question.id}
              className="w-full flex flex-col gap-2 relative"
              ref={(el) => {
                questionRefs.current[question.id] = el;
              }}
              onMouseEnter={() => {
                if (userType === "reviewer" && !isAddingComment) {
                  // 新しい質問エリアに入ったときに、前のカーソル位置をクリア
                  setCursorPosition(null);
                }
              }}
              onMouseMove={(e) => handleMouseMove(e, question.id)}
              onMouseLeave={handleMouseLeave}
              role="region"
              aria-label={`Question ${question.number} area`}
            >
              {/* Display all comments for this question with absolute positioning */}
              {questionComments.map((comment) => {
                const x = comment.position?.x ?? 0;
                const y = comment.position?.y ?? 0;

                // 右端に近い場合は左側に表示するための位置調整
                const adjustedX = x > 70 ? Math.max(0, x - 20) : x;
                const adjustedY = y > 80 ? Math.max(0, y - 10) : y;

                return (
                  <div
                    key={comment.id}
                    className="absolute"
                    style={{
                      left: `${adjustedX}%`,
                      top: `${adjustedY}%`,
                      zIndex: 99999, // 最前面に表示
                    }}
                  >
                    <Comment
                      {...comment}
                      userType={userType}
                      onDelete={handleDeleteComment}
                    />
                  </div>
                );
              })}

              {/* Show message circle icon at cursor position for reviewer */}
              {(() => {
                // デバッグ用ログ
                if (userType === "reviewer" && mode === "comment") {
                  console.log("Comment icon condition check:", {
                    userType,
                    mode,
                    cursorPosition: !!cursorPosition,
                    questionId: cursorPosition?.questionId,
                    currentQuestionId: question.id,
                    isAddingComment,
                  });
                }
                return (
                  userType === "reviewer" &&
                  mode === "comment" &&
                  cursorPosition &&
                  cursorPosition.questionId === question.id &&
                  !isAddingComment &&
                  !isAnyCommentOpen
                );
              })() && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${cursorPosition?.x || 0}%`,
                    top: `${cursorPosition?.y || 0}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 10, // 既存のコメントより低いz-index
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="pointer-events-auto p-0 bg-transparent hover:bg-transparent"
                    style={{ width: "24px", height: "24px" }}
                    onClick={() => setIsAddingComment(true)}
                  >
                    <MessageCircle
                      style={{ width: "24px", height: "24px" }}
                      className="text-[#138FB5]"
                    />
                  </Button>
                </div>
              )}

              {/* Comment creation form */}
              {isAddingComment &&
                cursorPosition &&
                cursorPosition.questionId === question.id && (
                  <div
                    className="fixed"
                    style={(() => {
                      const popupWidth = 448;
                      const margin = 8;
                      const parent =
                        questionRefs.current[question.id]?.parentElement;
                      let left = 0,
                        top = 0;
                      let popupHeight = 100; // デフォルト高さ
                      if (commentInputRef.current) {
                        popupHeight =
                          commentInputRef.current.offsetHeight || 100;
                      }
                      if (parent) {
                        const parentRect = parent.getBoundingClientRect();
                        const baseLeft =
                          parentRect.left +
                          parentRect.width * (cursorPosition.x / 100);
                        const baseTop =
                          parentRect.top +
                          parentRect.height * (cursorPosition.y / 100);
                        left = baseLeft;
                        top = baseTop;
                        // 右端が画面からはみ出す場合
                        if (left + popupWidth + margin > window.innerWidth) {
                          left = window.innerWidth - popupWidth - margin;
                        }
                        // 左端
                        if (left < margin) left = margin;
                        // 下端
                        if (top + popupHeight + margin > window.innerHeight) {
                          top = window.innerHeight - popupHeight - margin;
                        }
                        // 上端
                        if (top < margin) top = margin;
                      }
                      return {
                        left: `${left}px`,
                        top: `${top}px`,
                        zIndex: 40,
                        width: `${popupWidth}px`,
                        pointerEvents: "auto",
                      };
                    })()}
                  >
                    <div
                      ref={commentInputRef}
                      className="bg-white rounded-2xl border-2 border-[#838383] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.16)] w-[448px]"
                      role="presentation"
                    >
                      <div className="flex items-center gap-2.5 p-3 pl-6">
                        <Textarea
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="項目一つ追加して、既婚と離別・死別は分けた方がいいのでは？"
                          className="flex-1 min-h-[24px] resize-none border-none p-0 text-sm font-medium text-[#333333] placeholder:text-[#999999] focus-visible:ring-0 focus-visible:ring-offset-0"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 rounded-full bg-[#484848] hover:bg-[#333333]"
                          onClick={handleAddComment}
                          disabled={!newCommentText.trim()}
                        >
                          <Send className="w-3.5 h-3.5 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

              <Card className="flex flex-col items-start relative self-stretch w-full bg-white rounded-lg border border-solid border-[#dcdcdc]">
                <div className="flex items-center gap-3 relative self-stretch w-full bg-[#f8f9fa] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
                  <div className="inline-flex items-center justify-center px-4 py-2 relative bg-[#138FB5] rounded-[8px_0px_0px_0px]">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center leading-6 whitespace-nowrap">
                      {question.number}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-3 relative">
                    {question.isFixed && (
                      <div className="inline-flex items-center justify-center gap-1 relative">
                        <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center leading-6 whitespace-nowrap">
                          固定設問
                        </div>
                        <Lock className="w-4 h-4 text-[#333333]" />
                      </div>
                    )}

                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center leading-6 whitespace-nowrap">
                      {question.type}
                    </div>
                  </div>
                </div>

                <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
                  <div className="flex items-center gap-2 relative self-stretch w-full">
                    <div className="flex items-center relative flex-1 grow">
                      <div className="flex-1 mt-[-1.00px] font-medium text-[#333333] text-sm leading-6">
                        {question.question}
                      </div>
                    </div>
                  </div>

                  {question.type.includes("SA") && question.options && (
                    <Controller
                      name={question.id}
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value as string}
                          onValueChange={field.onChange}
                          className="flex flex-col items-start gap-2 relative self-stretch w-full"
                        >
                          {question.options?.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center gap-2 relative self-stretch w-full"
                            >
                              <div className="flex w-10 items-center justify-end relative">
                                <RadioGroupItem
                                  value={option.id}
                                  id={`${question.id}-${option.id}`}
                                  className="relative w-4 h-4"
                                />
                                <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                                  <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center leading-6 whitespace-nowrap">
                                    {option.id}
                                  </div>
                                </div>
                              </div>
                              <div className="rounded flex items-center px-2 py-0 relative flex-1 grow">
                                <Label
                                  htmlFor={`${question.id}-${option.id}`}
                                  className="flex items-start gap-2.5 relative flex-1 grow cursor-pointer"
                                >
                                  <div className="flex-1 mt-[-1.00px] font-normal text-[#333333] text-sm leading-6">
                                    {option.label}
                                  </div>
                                </Label>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  )}

                  {question.type.includes("NU") && (
                    <div className="flex flex-col items-start relative self-stretch w-full">
                      <div className="flex items-center gap-2 relative self-stretch w-full">
                        <div className="flex w-10 items-center justify-end relative">
                          <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                            <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center leading-6 whitespace-nowrap">
                              1
                            </div>
                          </div>
                        </div>
                        <div className="gap-2 flex items-center px-2 py-0 relative flex-1 grow">
                          <Controller
                            name={question.id}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                className="relative w-[104px] h-6 rounded border border-solid border-[#dcdcdc]"
                              />
                            )}
                          />
                          <div className="w-fit mt-[-1.00px] font-normal text-[#333333] text-xs whitespace-nowrap leading-6">
                            {question.suffix}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {question.placeholder && (
                    <div className="flex flex-col items-start relative self-stretch w-full">
                      <div className="flex items-center gap-4 relative self-stretch w-full">
                        <div className="flex w-10 items-center justify-end relative">
                          <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                            <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center leading-6 whitespace-nowrap">
                              1
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center relative flex-1 grow">
                          <Controller
                            name={question.id}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={question.placeholder}
                                className="flex w-[200px] items-center justify-center gap-2.5 relative rounded border border-solid border-[#dcdcdc] px-3 py-1"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(question.type.includes("MA") ||
                    question.type.includes("GR")) &&
                    question.options && (
                      <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                        {question.options?.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2 relative self-stretch w-full"
                          >
                            <div className="flex w-10 items-center justify-end relative">
                              <Checkbox
                                id={`${question.id}-${option.id}`}
                                className="relative w-4 h-4"
                                checked={
                                  userType === "reviewer"
                                    ? (checkboxStates[question.id]?.[
                                        option.id
                                      ] ?? false)
                                    : (
                                        (watch(question.id) as string[]) || []
                                      ).includes(option.id)
                                }
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(
                                    question.id,
                                    option.id,
                                    checked as boolean,
                                  )
                                }
                              />
                              <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center leading-6 whitespace-nowrap">
                                  {option.id}
                                </div>
                              </div>
                            </div>
                            <div className="rounded flex items-center px-2 py-0 relative flex-1 grow">
                              <Label
                                htmlFor={`${question.id}-${option.id}`}
                                className="flex items-start gap-2.5 relative flex-1 grow cursor-pointer"
                              >
                                <div className="flex-1 mt-[-1.00px] font-normal text-[#333333] text-sm leading-6">
                                  {option.label}
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </Card>
    </div>
  );
};
