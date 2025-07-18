"use client";

import { Bot, ChevronRightIcon, CircleHelp, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SurveyAiChat } from "@/components/survey-ai/survey-ai-chat";
import { SurveyCardHeader } from "@/components/survey-card-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionFormData = {
  fixedScreeningQuestions: string[];
  screeningQuestions: string[];
  mainSurveyQuestions: string[];
};

const userMessages: string[] = [];
const aiResponses = [
  {
    text: "セクション設定を進めましょう！\n調査の大まかな項目（セクション）を設定してください。\nスクリーニング設問・本調査設問とも、ここまでに入力した内容からあらかじめ推奨される項目が設定されます。",
  },
];

const Page = () => {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);
  const [mainSurveyQuestions, setMainSurveyQuestions] = useState<string[]>([]);

  const fixedScreeningQuestions = ["性別", "年齢", "居住地（都道府県単位）"];

  const { handleSubmit } = useForm<SectionFormData>();

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
      console.log("AIチャットパネルが閉じられました - メインエリアを拡大");
    }
  }, [isChatOpen, isTransitioning]);

  const onSubmit = (data: SectionFormData) => {
    const finalData = {
      ...data,
      screeningQuestions,
      mainSurveyQuestions,
      fixedScreeningQuestions,
    };
    console.log(finalData);
    // Navigate to question preview page
    router.push("/surveys/question/preview");
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
              "flex flex-col gap-0 transition-all duration-300",
              "w-[calc(100%-500px)]" // 常に同じ幅を維持
            )}
          >
            <SurveyCardHeader
              workingTitle="00008　男性化粧品についての調査"
              currentStep={1}
              enableDefaultNavigation={true}
            />
            <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full items-start"
              >
                {/* Header Section */}
                <header className="flex items-start gap-4 w-full">
                  <div className="w-2 h-6 bg-[#60adc2]" />
                  <div className="flex flex-col items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#333333] whitespace-nowrap">
                        セクション入力
                      </h2>
                    </div>
                  </div>
                </header>
                {/* Info Banner */}
                <div className="flex flex-col items-start gap-2 px-6 py-0 w-full rounded overflow-hidden">
                  <div className="flex items-center w-full">
                    <p className="text-sm font-medium text-[#333333]">
                      セクションを入力し右の「AIと話す」ボタンを押すと
                      <span className="inline-flex items-center whitespace-nowrap">
                        調査AI
                        <CircleHelp className="w-4 h-4 text-gray-500 mx-1" />
                      </span>
                      とチャットで相談しながら詳細を設定できます。
                    </p>
                  </div>
                </div>

                {/* Fixed Screening Questions */}
                <div className="flex flex-col items-start gap-6 w-full">
                  <div className="flex flex-col items-end w-full">
                    <div className="flex h-10 items-center gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-[#333333] whitespace-nowrap">
                          スクリーニング設問【固定】
                        </label>
                        <CircleHelp className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <textarea
                        value={fixedScreeningQuestions.join("\n")}
                        readOnly
                        className="flex min-h-[120px] items-start px-4 py-3 w-full bg-gray-100 rounded border-2 border-solid border-[#dcdcdc] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] text-sm font-medium text-gray-500 resize-none focus:outline-none"
                        style={{
                          fontFamily: "Noto Sans JP",
                          lineHeight: "1.714",
                        }}
                      />
                    </div>
                  </div>

                  {/* Screening Questions */}
                  <div className="flex flex-col items-end w-full">
                    <div className="flex h-10 items-center gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-[#333333] whitespace-nowrap">
                          スクリーニング設問
                        </label>
                        <CircleHelp className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <textarea
                        value={screeningQuestions.join("\n")}
                        onChange={(e) => {
                          const questions = e.target.value
                            .split("\n")
                            .filter((q) => q.trim() !== "");
                          setScreeningQuestions(questions);
                        }}
                        className="flex min-h-[120px] items-start px-4 py-3 w-full bg-white rounded border-2 border-solid border-[#dcdcdc] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] text-sm font-medium text-[#333333] placeholder:text-[#ababab] placeholder:text-base placeholder:font-normal resize-none focus:outline-none focus:border-[#138FB5]"
                        placeholder="スクリーニング設問を入力してください。新しい行で項目を区切ってください。"
                        style={{
                          fontFamily: "Noto Sans JP",
                          lineHeight: "1.714",
                        }}
                      />
                    </div>
                  </div>

                  {/* Main Survey Questions */}
                  <div className="flex flex-col items-end w-full">
                    <div className="flex h-10 items-center gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-[#333333] whitespace-nowrap">
                          本調査設問
                        </label>
                        <CircleHelp className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <textarea
                        value={mainSurveyQuestions.join("\n")}
                        onChange={(e) => {
                          const questions = e.target.value
                            .split("\n")
                            .filter((q) => q.trim() !== "");
                          setMainSurveyQuestions(questions);
                        }}
                        className="flex min-h-[180px] items-start px-4 py-3 w-full bg-white rounded border-2 border-solid border-[#dcdcdc] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] text-sm font-medium text-[#333333] placeholder:text-[#ababab] placeholder:text-base placeholder:font-normal resize-none focus:outline-none focus:border-[#138FB5]"
                        placeholder="本調査設問を入力してください。新しい行で項目を区切ってください。"
                        style={{
                          fontFamily: "Noto Sans JP",
                          lineHeight: "1.714",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </form>
              <div className="flex justify-center pb-10 bg-[#ffffff]">
                <Button
                  type="submit"
                  className="w-[340px] h-14 bg-[#556064] rounded-[34px] flex items-center justify-center gap-4 px-4 py-0"
                  onClick={() => router.push("/surveys/question/preview")}
                >
                  <span className="font-bold text-white text-base text-center tracking-[0] leading-[22.4px] font-['Noto_Sans_JP',Helvetica]">
                    調査票設問の設定に進む
                  </span>
                  <ChevronRightIcon className="w-[6.68px] h-[11.89px]" />
                </Button>
              </div>
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
