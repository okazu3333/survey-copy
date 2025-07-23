"use client";

import { Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { SurveyAiChat } from "@/components/survey-ai/survey-ai-chat";
import { SurveyCardHeader } from "@/components/survey-card-header";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../_components/mode-toggle";
import { SurveyEditSection } from "./_components/survey-edit-section";

const userMessages: string[] = [];
const aiResponses = [
  {
    text: "設問の設定を進めましょう！\n調査の設問を設定してください。\nスクリーニング設問・本調査設問とも、ここまでに入力した内容からあらかじめ推奨される設問が設定されます。",
  },
];

const Page = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="w-full py-6 px-4">
        <div
          className={cn(
            "flex gap-4 max-w-[1440px] mx-auto",
            // AIチャットパネルが閉じている時は中央配置
            !isChatOpen && "justify-center",
          )}
        >
          {/* 左：メインコンテンツ */}
          <div
            className={cn(
              "flex flex-col gap-0 transition-all duration-300",
              "w-[calc(100%-500px)]", // 常に同じ幅を維持
            )}
          >
            <SurveyCardHeader
              title="設問の設定"
              workingTitle=""
              currentStep={2}
              enableDefaultNavigation={true}
            />
            <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
              {/* Header Section with Mode Toggle */}
              <ModeToggle currentMode="edit" />

              {/* Survey Edit Area */}
              <SurveyEditSection />
            </div>
          </div>
          {/* 右：AIチャット */}
          <div
            className={cn(
              "transition-all duration-300 flex",
              isChatOpen ? "w-[500px]" : "w-16",
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
                    <span className="text-white text-xs font-bold">
                      AIと話す
                    </span>
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
