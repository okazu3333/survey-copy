"use client";

import { Bot, ChevronRightIcon, CircleHelp, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SurveyAiChat } from "@/components/survey-ai/survey-ai-chat";
import { SurveyCardHeader } from "@/components/survey-card-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublishAvailableConfirmDialog } from "./_components/publish-available-confirm-dialog";
import { cn } from "@/lib/utils";

type SurveyFormData = {
  title: string;
  purpose: string;
  targetConditions: string;
  analysisConditions: string;
  methodology: string;
  budget: string;
};

const surveyFields = [
  {
    id: "title" as const,
    label: "調査タイトル",
    defaultValue: "",
    placeholder: "調査タイトルを入力してください",
    isTextarea: false,
  },
  {
    id: "purpose" as const,
    label: "調査目的",
    defaultValue: "",
    placeholder: "調査目的を入力してください",
    isTextarea: false,
  },
  {
    id: "targetConditions" as const,
    label: "調査対象者条件",
    defaultValue: "",
    placeholder: "調査対象者条件を入力してください",
    isTextarea: true,
  },
  {
    id: "analysisConditions" as const,
    label: "分析対象者条件",
    defaultValue: "",
    placeholder: "分析対象者条件を入力してください",
    isTextarea: true,
  },
  {
    id: "methodology" as const,
    label: "調査手法",
    defaultValue: "",
    placeholder: "想定している調査手法があれば入力してください。",
    isTextarea: false,
  },
  {
    id: "budget" as const,
    label: "調査規模（予算）",
    defaultValue: "",
    placeholder: "調査規模（予算）を入力してください",
    isTextarea: false,
  },
];

const userMessages: string[] = [];
const aiResponses = [
  {
    text: "まずは調査概要を設定しましょう！\n今回の調査の情報を教えてください。調査概要をPDFファイルで用意している場合は、その情報を基にAIで自動入力・設定できます。\n例：(具体的なサービス名)の使用率",
  },
];

const Page = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { register, handleSubmit } = useForm<SurveyFormData>({
    defaultValues: {
      title: surveyFields[0].defaultValue,
      purpose: surveyFields[1].defaultValue,
      targetConditions: surveyFields[2].defaultValue,
      analysisConditions: surveyFields[3].defaultValue,
      methodology: surveyFields[4].defaultValue,
      budget: surveyFields[5].defaultValue,
    },
  });

  // AIチャットパネルの開閉イベント処理
  const handleChatToggle = (collapsed: boolean) => {
    setIsTransitioning(true);
    setIsChatOpen(!collapsed);
    
    // トランジション完了後にフラグをリセット
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // CSS transition durationと合わせる
  };

  // パネルが閉じた時のイベント処理
  useEffect(() => {
    if (!isChatOpen && !isTransitioning) {
      // パネルが閉じた時の処理
      // メインエリアの幅が拡大し、レビューページと同様の構成になる
      console.log("AIチャットパネルが閉じられました - メインエリアを拡大");
    }
  }, [isChatOpen, isTransitioning]);

  const onSubmit = (data: SurveyFormData) => {
    console.log(data);
    setIsDialogOpen(true);
  };

  const handleEditSurvey = () => {
    setIsDialogOpen(false);
    // Navigate to edit survey or scroll to form
  };

  const handleProceedAnyway = () => {
    setIsDialogOpen(false);
    // Navigate to next step
    console.log("Proceeding to next step");
  };

  const handleStepClick = (stepIndex: number) => {
    // ステップに応じてページ遷移
    switch (stepIndex) {
      case 0: // 概要の設定
        // 現在のページなので何もしない
        break;
      case 1: // セクションの設定
        // セクション設定ページに遷移
        router.push("/surveys/question/edit");
        break;
      case 2: // 設問の設定
        // 設問設定ページに遷移
        router.push("/surveys/question/edit");
        break;
      case 3: // レビュー
        // レビューページに遷移
        router.push("/surveys/review");
        break;
      case 4: // 調査票の確定
        // 調査票確定ページに遷移
        router.push("/surveys/complete");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="w-full py-6 px-4">
        <div className={cn(
          "flex gap-4 max-w-[1440px] mx-auto",
          // AIチャットパネルが閉じている時は中央配置
          !isChatOpen && "justify-center"
        )}>
          {/* 左：メインコンテンツ */}
          <div
            className={cn(
              "flex flex-col gap-4 transition-all duration-300",
              isChatOpen 
                ? "w-[calc(100%-500px)]" // 開いている時：元のサイズ
                : "w-[calc(100%-500px)]" // 閉じている時：前のサイズを維持
            )}
          >
            <SurveyCardHeader
              workingTitle=""
              currentStep={0}
              onStepClick={handleStepClick}
            />
            <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full items-start"
              >
                {/* Survey Overview Section */}
                <header className="flex items-start gap-4 w-full">
                  <div className="w-2 h-6 bg-[#60adc2]" />
                  <div className="flex flex-col items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#333333] whitespace-nowrap">
                        調査概要入力
                      </h2>
                    </div>
                  </div>
                </header>
                {/* Info Banner */}
                <div className="flex flex-col items-start gap-2 px-6 py-0 w-full rounded overflow-hidden">
                  <div className="flex items-center w-full">
                    <p className="text-sm font-medium text-[#333333]">
                      概要を入力し右の「AIと話す」ボタンを押すと
                      <span className="inline-flex items-center whitespace-nowrap">
                        調査AI
                        <CircleHelp className="w-4 h-4 text-gray-500 mx-1" />
                      </span>
                      とチャットで相談しながら詳細を設定できます。
                    </p>
                  </div>
                </div>
                {/* Survey Form Fields */}
                <div className="flex flex-col items-start gap-10 w-full">
                  <div className="flex flex-col items-start gap-4 w-full">
                    <div className="flex flex-col items-start gap-6 w-full">
                      {surveyFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex flex-col items-end w-full"
                        >
                          <div className="flex h-10 items-center gap-4 w-full">
                            <div className="flex items-center gap-2">
                              <label
                                className="text-sm font-bold text-[#333333] whitespace-nowrap"
                                htmlFor={field.id}
                              >
                                {field.label}
                              </label>
                              <CircleHelp className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-full">
                            {field.isTextarea ? (
                              <textarea
                                {...register(field.id)}
                                id={field.id}
                                placeholder={field.placeholder}
                                className="flex min-h-[96px] items-start px-4 py-3 w-full bg-white rounded border-2 border-solid border-[#dcdcdc] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] text-sm font-medium text-[#333333] placeholder:text-[#ababab] placeholder:text-base placeholder:font-normal resize-none focus:outline-none focus:border-[#138FB5]"
                                rows={4}
                              />
                            ) : (
                              <input
                                {...register(field.id)}
                                id={field.id}
                                type="text"
                                placeholder={field.placeholder}
                                className="flex h-12 items-center px-4 py-3 w-full bg-white rounded border-2 border-solid border-[#dcdcdc] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] text-sm font-medium text-[#333333] placeholder:text-[#ababab] placeholder:text-base placeholder:font-normal focus:outline-none focus:border-[#138FB5]"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Distribution Section */}
                <div className="flex flex-col items-start gap-6 w-full">
                  {/* Distribution Section Header */}
                  <div className="flex flex-col items-end w-full">
                    <div className="flex h-10 items-center gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-[#333333] whitespace-nowrap">
                          配信ついて
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Distribution Outlook */}
                  <div className="flex flex-col items-end w-full">
                    <div className="flex h-10 items-center gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <label
                          className="text-sm font-bold text-[#333333] whitespace-nowrap"
                          htmlFor="distribution-outlook"
                        >
                          配信の見通し
                        </label>
                        <CircleHelp className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>

                    <Card className="w-full rounded-lg overflow-hidden">
                      <CardContent className="p-4">
                        <p className="text-sm font-bold text-[#333333] mb-4">
                          配信見通しが、不十分な場合、下記に対応策を表示します。
                        </p>

                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            className="h-8 rounded-[32px] border-2 border-[#d96868] text-[#d96868] ml-auto"
                          >
                            <span className="font-bold text-xs whitespace-nowrap">
                              Element Bridgeでシミュレーション
                            </span>
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Suggestion Quality */}
                  <div className="flex flex-col w-full items-end">
                    <div className="flex h-10 items-center gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <label
                          className="text-sm font-bold text-[#333333] whitespace-nowrap"
                          htmlFor="ai-suggestion-quality"
                        >
                          調査AIからの提案の質
                        </label>
                        <CircleHelp className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>

                    <Card className="w-full rounded-lg">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4 w-full">
                          <div className="flex items-center gap-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-4 h-4 bg-[#4bbc80] rounded-lg"
                              />
                            ))}
                          </div>
                          <p className="flex-1 text-sm font-medium text-[#333333]">
                            調査票セクション・調査票設問の設定に必要な情報が揃っています。
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </form>
              <div className="flex justify-center pb-10 bg-[#ffffff]">
                <Button
                  type="submit"
                  className="w-[340px] h-14 bg-[#556064] rounded-[34px] flex items-center justify-center gap-4 px-4 py-0"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <span className="font-bold text-white text-base text-center tracking-[0] leading-[22.4px] font-['Noto_Sans_JP',Helvetica]">
                    調査票セクションの設定
                  </span>
                  <ChevronRightIcon className="w-[6.68px] h-[11.89px]" />
                </Button>
              </div>
              <PublishAvailableConfirmDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onEditSurvey={handleEditSurvey}
                onProceedAnyway={handleProceedAnyway}
              />
            </div>
          </div>
          {/* 右：AIチャット */}
          <div
            className={cn(
              "transition-all duration-300 flex",
              isChatOpen ? "w-[500px]" : "w-16"
            )}
          >
            {isChatOpen ? (
              <SurveyAiChat
                autoExpand={true}
                userMessages={userMessages}
                aiResponses={aiResponses}
                onCollapseChange={handleChatToggle}
              />
            ) : (
              <div className="w-16 h-16 bg-[#138fb5] rounded-[0px_0px_0px_8px] transition-all duration-300 ease-in-out">
                <button
                  onClick={() => handleChatToggle(false)}
                  className="flex flex-col items-center justify-center w-full h-16 cursor-pointer"
                  type="button"
                >
                  <div className="flex flex-col items-center gap-0">
                    <Bot className="w-6 h-6 text-white" />
                    <span className="text-white text-xs font-bold">AIと話す</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
