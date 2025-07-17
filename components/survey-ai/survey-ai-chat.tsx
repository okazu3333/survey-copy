import {
  Bot,
  Check,
  ChevronsRight,
  CirclePlus,
  HelpCircle,
  List,
  Send,
  Trash2,
} from "lucide-react";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { SurveyAiChatHistory } from "./survey-ai-chat-history";
import { SurveyImportDialog } from "./survey-import-dialog";

// AI Response types
type AiSuggestion = {
  text: string;
  type: "add" | "delete";
  section: "本調査設問" | "スクリーニング設問";
};

type AiResponse = {
  text: string;
  suggestions?: AiSuggestion[];
};

type SurveyAiChatProps = {
  onCollapseChange?: (isCollapsed: boolean) => void;
  userMessages?: string[];
  aiResponses?: AiResponse[];
  autoExpand?: boolean;
};

export const SurveyAiChat = ({
  onCollapseChange,
  userMessages = [],
  aiResponses = [],
  autoExpand = false,
}: SurveyAiChatProps) => {
  // const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(!autoExpand);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Auto expand on mount if autoExpand is true
  useEffect(() => {
    if (autoExpand) {
      setIsCollapsed(false);
      onCollapseChange?.(false);
    }
    // 自然なアニメーションのために少し遅延して表示
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [autoExpand, onCollapseChange]);

  const handleFileImport = (file: File) => {
    console.log("Imported file:", file.name);
    // ここでファイル処理のロジックを実装
  };

  const handleChatHistorySelect = (historyId: string) => {
    console.log("Selected chat history:", historyId);
    // ここでチャット履歴の選択処理を実装
    setIsChatHistoryOpen(false);
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);

    // アニメーションのための状態リセット
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
  };

  // 折りたたまれた状態の場合のみ「AIと話す」ボタンを表示
  if (isCollapsed) {
    return (
      <div
        className={`relative w-16 h-16 bg-[#138fb5] rounded-[0px_0px_0px_8px] transition-all duration-500 ease-out transform hover:scale-105 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          onClick={toggleCollapse}
          className="flex flex-col items-center justify-center w-full h-16 cursor-pointer"
          type="button"
        >
          <div className="flex flex-col items-center gap-0">
            <Bot className="w-6 h-6 text-white" />
            <span className="text-white text-xs font-bold">AIと話す</span>
          </div>
        </button>
      </div>
    );
  }

  // 展開された状態を表示
  return (
    <div
      className={`flex flex-col w-[480px] h-[calc(100vh-88px)] relative transition-all duration-500 ease-out transform ${
        isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
    >
      {/* Header */}
      <header className="flex w-full h-16 items-center justify-between px-6 py-0 bg-[#138fb5] flex-shrink-0">
        <div className="flex w-[212px] items-center gap-2 relative">
          <Bot className="w-6 h-6 text-white" />
          <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap font-bold-16">
              調査AI
            </div>

            <div className="inline-flex items-center pt-0.5 pb-0 px-0 relative self-stretch flex-[0_0_auto]">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <button
          onClick={toggleCollapse}
          className="flex flex-col w-6 items-center justify-center relative cursor-pointer"
          type="button"
        >
          <ChevronsRight className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* Chat Messages Area */}
      <ScrollArea className="flex-1 w-full bg-gray-50 py-2">
        <div className="relative w-full -top-2">
          {/* First AI Message with File Upload Button */}
          {aiResponses.length > 0 && (
            <div className="flex items-start mb-4">
              <Bot className="w-6 h-6 mt-4 ml-3 mr-1 text-[#138fb5]" />
              <Card className="max-w-[340px] bg-white rounded-[20px_20px_20px_0px] border-[#d0cfcf]">
                <CardContent className="p-4">
                  <p className="text-fontdefault text-sm font-medium leading-6">
                    {aiResponses[0].text}
                  </p>
                  {/* Show button only if first message mentions file upload */}
                  {aiResponses[0].text.includes("ファイル") && (
                    <Button
                      className="mt-4 w-[236px] h-8 rounded-3xl bg-white hover:bg-gray-100 text-[#138fb5] text-xs font-bold border border-[#138fb5]"
                      onClick={() => setIsImportDialogOpen(true)}
                    >
                      <CirclePlus className="w-4 h-4 mr-1" />
                      調査概要をファイルから読み込む
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Message pairs - map through data */}
          {userMessages.map((message, index) => (
            <React.Fragment key={message}>
              {/* User Message */}
              <div className="flex justify-end px-6 mb-4">
                <div className="max-w-[340px] px-4 py-2 bg-[#ffe9a3] rounded-[20px_20px_2px_20px]">
                  <p className="text-black-1000 text-sm font-medium leading-6">
                    {message}
                  </p>
                </div>
              </div>

              {/* AI Response */}
              {aiResponses[index + 1] && (
                <div className="flex flex-col mb-4">
                  <div className="flex items-start">
                    <Bot className="w-6 h-6 mt-4 ml-3 mr-1 text-[#138fb5]" />
                    <Card className="max-w-[340px] w-[321px] bg-white rounded-[20px_20px_20px_2px] border-[#dcdcdc]">
                      <CardContent className="p-4">
                        <p className="text-fontdefault text-sm font-medium leading-6">
                          {aiResponses[index + 1].text}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  {aiResponses[index + 1].suggestions && (
                    <div className="ml-10 mt-2 space-y-2">
                      {aiResponses[index + 1].suggestions?.map(
                        (suggestion, suggestionIndex) => (
                          <div
                            key={suggestionIndex}
                            className="bg-[#e7ecf0] rounded-lg p-3 flex flex-col gap-1 max-w-[340px]"
                          >
                            <div className="flex items-center gap-1.5 w-full">
                              <div className="w-6 h-6 bg-white rounded flex items-center justify-center flex-shrink-0">
                                {suggestion.type === "add" ? (
                                  <Check className="w-5 h-5 text-[#4bbc80]" />
                                ) : (
                                  <Trash2 className="w-5 h-5 text-[#d96868]" />
                                )}
                              </div>
                              <span className="font-bold text-[#333333] text-sm leading-[1.714] font-['Noto_Sans_JP']">
                                【{suggestion.section}】
                                {suggestion.type === "add"
                                  ? "に追加"
                                  : "から削除"}
                              </span>
                            </div>
                            <p className="font-bold text-[#333333] text-xs leading-[2] font-['Noto_Sans_JP'] ml-0">
                              {suggestion.text}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="relative w-full h-[170px] bg-[#138fb5] rounded-[0px_0px_0px_8px] shadow-main-bg flex-shrink-0">
        <div className="flex flex-wrap w-full items-start gap-[10px_42px] px-6 py-4">
          <div className="flex items-center gap-4 w-full">
            <Textarea
              className="w-full h-16 min-h-16 bg-areawhite rounded-lg shadow-shadow-default px-4 py-1.5 pr-12 text-fontdefault text-base font-medium leading-6 resize-none"
              placeholder="メッセージを入力してください"
              rows={2}
            />
            <Button
              className="w-9 h-[38.49px] bg-[#484848] hover:bg-[#333333] rounded-full p-0 flex items-center justify-center"
              type="button"
            >
              <Send className="w-[14px] h-[14px] text-white" />
            </Button>
          </div>

          {/* File Upload Button */}
          <div className="flex items-center gap-4 w-full">
            <Button
              className="w-full h-8 rounded-3xl bg-white hover:bg-gray-100 text-[#138fb5] text-xs font-bold border border-[#138fb5]"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <CirclePlus className="w-4 h-4 mr-1" />
              調査概要をファイルから読み込む
            </Button>
          </div>
        </div>

        {/* Chat History Button */}
        <div className="absolute bottom-0 left-0 w-full h-8">
          <Button
            className="w-full h-8 bg-[#484848] hover:bg-[#3a3a3a] rounded-[0px_0px_0px_8px] justify-start"
            onClick={() => setIsChatHistoryOpen(true)}
          >
            <List className="w-4 h-4 mr-2" />
            <span className="text-white text-xs font-medium leading-6">
              チャット履歴を確認
            </span>
          </Button>
        </div>
      </div>

      {/* Chat History Panel */}
      <SurveyAiChatHistory
        isOpen={isChatHistoryOpen}
        onClose={() => setIsChatHistoryOpen(false)}
        onSelectHistory={handleChatHistorySelect}
      />

      {/* Survey Import Dialog */}
      <SurveyImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onFileImport={handleFileImport}
      />
    </div>
  );
};
